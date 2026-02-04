const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('./../Utils/cloudinary');
const getDataUri = require('./../Utils/datauri');

const registerUser = async (req, res) => {
    try {
        const {name , email , phoneNumber,  password} = req.body;
        const file = req.file;

        if(!name || !email || !phoneNumber || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const existinguser = await User.findOne({email});
        if(existinguser){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let profilePic = "";

        if(file){
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePic = cloudResponse?.secure_url;
        }

        const newUser = await User.create({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            profilePic
        })

        // console.log("User registered:", newUser);

        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: newUser._id,
                name: newUser.name,
                phoneNumber: newUser.phoneNumber,
                email: newUser.email,
                profilePic: newUser.profilePic
            }
        })
        

    } catch (error) {
        console.error("User registration error:", error);
        return res.status(500).json({
            message: "User registration failed",
            success: false,
            error: error.message
        })
    }
}

const login = async (req, res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid credentials"});
        }

        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '2d' });
        
        return res.status(200).cookie('token', token ,{
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            httpOnly: true,
            secure: true,               // ✅ Important for HTTPS
            sameSite: "None"  
        }).json({
            message: "User logged in successfully",
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: "User login failed",
            success: false,
            error: error.message
        })
    }
}

const logout = async (req, res)=>{
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        return res.status(200).json({
            message: "User logged out successfully",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "User logout failed",
            success: false,
            error: error.message
        });
    }
}

const getOtherUsers = async (req, res) =>{
    try {
        const userId = req.id;

        if(!userId){
            return res.status(400).json({message: "Unauthorized access"});
        }

        const users = await User.find({_id : {$ne : userId}}).select('-password -__v');

        return res.status(200).json({
            message: "Other users fetched successfully",
            success: true,
            users
        });

    } catch (error) {
        console.error("Error fetching other users:", error);
        return res.status(500).json({
            message: "Failed to fetch other users",
            success: false,
            error: error.message
        });
    }
}

const getMyprofile = async (req, res) =>{
    try {
        const userId = req.id;
        if(!userId){
            return res.status(400).json({message: "Unauthorized access"});
        }

        const user = await User.findById(userId).select('-password -__v');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        return res.status(200).json({
            message: "User profile fetched successfully",
            success: true,
            user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get user profile",
            success: false,
            error: error.message
        })
    }
}

const getUserprofileById= async (req, res) =>{
    try{
        const userId = req.params.id;
        if(!userId){
            return res.status(400).json({message: "User ID is required"});
        }

        const user = await User.findById(userId).select('-password -__v');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        return res.status(200).json({
            message: "User profile fetched successfully",
            success: true,
            user
        })

    } catch (error) {
        return res.status(500).json({
            message: "Failed to get user profile",
            success: false,
            error: error.message
        })
    }
} 

const updateUserprofile = async (req,res)=>{
    try {
        const userId = req.id;

        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found" , success: false});
        }

        const file = req.file; 
        let profilePic = user.profilePic;

        if(file){
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePic = cloudResponse?.secure_url;
        }

        const updatedData = {...req.body, profilePic};
        
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new: true}).select('-password -__v');

        return res.status(200).json({
            message: "User profile updated successfully",
            success: true,
            user: updatedUser
        })
        

    } catch (error) {
        return res.status(500).json({
            message: "User profile update failed",
            success: false,
            error: error.message
        })
    }
}

const resetPassword = async(req, res)=>{
    try {
        const { email, password } = req.body;

        // Validate user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully, please login",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    registerUser,
    login,
    logout,
    getOtherUsers,
    getUserprofileById,
    resetPassword,
    getMyprofile,
    updateUserprofile
}
