import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js ";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {

    const { email, password, fullName } = req.body;
    try {
        // hash password
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const existingUser = await User.find({ email });
        if (existingUser.length > 0) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,

        });

        if (newUser) {
            // jwt token generation
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
            });
        } else {
            return res.status(400).json({ message: 'User not created' });
        }

    } catch (error) {
        console.error('Error during signup:', error.message); z
        res.status(500).json({ message: 'Internal server error' });

    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return res.status(400).json({
            message: "Invalid Credentials"
        })

        generateToken(user._id, res)

        console.log(user)
        // res.status(200).json({

        //     id: user._id,
        //     fullName: user.fullName,
        //     email: user.email,
        //     profilePic: user.profilePic,
        // })

        res.status(200).json(user)

    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal server error' });

    }


}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({
            message: "User Logged Out "
        })
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal server error' });

    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id
        if (!profilePic) return res.status(400).json({
            message: "Profile pic is required"
        })

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true })

        res.status(200).json(updatedUser)

    } catch (error) {

    }
}

export const checkAuth = async (req, res) => {
    try {
        console.log("From the auth controller /check route" , req.user)
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkauth controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })

    }
}