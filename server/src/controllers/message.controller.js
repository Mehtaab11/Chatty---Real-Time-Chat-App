import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({
            _id: { $ne: loggedInUserId }
        }).select("-password")

        res.status(200).json(filteredUser)
    } catch (error) {
        console.error("Error in getUserForSidebar:", {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: "Failed to fetch users for sidebar. Please try again later." });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id
        const messages = await Message.find({
            $or: [
                { senderId: myId, recieverId: userToChatId },
                { senderId: userToChatId, recieverId: myId }
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.error("Error in getMessages controller:", {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: "Failed to retrieve messages. Please try again later." });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: recieverId } = req.params
        const senderId = req.user._id

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl,
        })

        await newMessage.save()

        const recieverSocketId = getRecieverSocketId(recieverId);
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.error("Error in sendMessage controller:", {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
}
