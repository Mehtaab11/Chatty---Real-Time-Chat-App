import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        // console.log("From the getUserForSidebar", loggedInUserId)
        // console.log("Inside the .user route", loggedInUserId)
        const filteredUser = await User.find({
            _id: { $ne: loggedInUserId }
        }).select("-password")

        res.status(200).json(filteredUser)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
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
        console.error(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const sendMessage = async (req, res) => {

    try {
        const { text, image } = req.body;
        const { id: recieverId } = req.params
        const senderId = req.user._id

        let imageUrl;

        if (image) {
            // Upload it to cloudinary

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


        const recieverSocketId = getRecieverSocketId(recieverId)

        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }


        res.status(201).json(
            newMessage
        )
    } catch (error) {


        console.log(error);
        res.status(401).json(
            { message: "Internal Server Error" }
        )
    }
}