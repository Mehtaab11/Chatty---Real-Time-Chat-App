import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js ";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
    const { email, password, fullName } = req.body;
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        
        if (newUser) {
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
        console.error('Signup Error:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Signup failed. Please try again later.' });
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
        if (!isValid) return res.status(400).json({ message: "Invalid Credentials" })

        generateToken(user._id, res)

        console.log(user)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.error('Login Error:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Login failed. Please try again later.' });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "User Logged Out" })
    } catch (error) {
        console.error('Logout Error:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Logout failed. Please try again later.' });
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
        console.error("Update Profile Error:", {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: "Failed to update profile. Please try again later." });
    }
}

export const checkAuth = (req, res) => {
    try {
        console.log("From the auth controller /check route", req.user)
        res.status(200).json(req.user)
    } catch (error) {
        console.error("CheckAuth Error:", {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: "Auth check failed. Please try again later." })
    }
}
