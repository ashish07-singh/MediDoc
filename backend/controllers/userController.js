import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import Chat from "../models/Chat.js";
import { v2 as cloudinary } from 'cloudinary';
import sendEmail from "../utils/sendEmail.js"; 

// === Start Chat (Replaces Payment System) ===
const startChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const { doctorId } = req.body;

        const doctor = await doctorModel.findById(doctorId);
        if (!doctor || !doctor.available) {
            return res.status(400).json({ success: false, message: 'Doctor is not available for chat.' });
        }

        // Create a new chat session directly without payment
        const newChat = await Chat.create({
            userId,
            doctorId,
            amount: 0, // No payment
            paymentStatus: true, // Access granted immediately
            paymentDetails: {
                orderId: `order_free_${Date.now()}`,
                paymentId: null,
                signature: null
            },
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24-hour access
        });

        const chat = await Chat.findById(newChat._id).populate('doctorId', 'name speciality image');

        res.json({ success: true, message: 'Chat session started', chat });
    } catch (error) {
        console.error("Chat initiation failed:", error);
        res.status(500).json({ success: false, message: 'Chat initiation failed' });
    }
};


// === User Profile Management (Corrected for Security) ===

const getProfile = async (req, res) => {
    try {
        // SECURITY FIX: Get the userId from the authenticated token.
        const userId = req.user.id;
        const userData = await userModel.findById(userId).select('-password');
        res.json({ success: true, userData });
    } catch (error)
        {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        // SECURITY FIX: Get the userId from the authenticated token.
        const userId = req.user.id;
        const { name, phone, address, dob, gender } = req.body;
        // ... rest of the function is good ...
        const imageFile = req.file;
        if (!name || !phone || !dob || !gender) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        const updateData = { name, phone, dob, gender };
        if (address) {
            updateData.address = JSON.parse(address);
        }
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image", folder: "user_profiles" });
            updateData.image = imageUpload.secure_url;
        }
        await userModel.findByIdAndUpdate(userId, updateData);
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// --- The functions below are already perfect. No changes were needed. ---

const sendChatMessage = async (req, res) => {
    try {
        const { chatId, text } = req.body;
        const userId = req.user.id;
        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, message: "Message cannot be empty" });
        }
        const chat = await Chat.findOne({_id: chatId, userId, paymentStatus: true, expiresAt: { $gt: new Date() }});
        if (!chat) {
            return res.status(403).json({ success: false, message: "Chat not found or access denied" });
        }
        chat.messages.push({ sender: 'user', text, createdAt: new Date()});
        await chat.save();
        res.json({ success: true, message: "Message sent", chat});
    } catch (error) {
        console.error("Message send error:", error);
        res.status(500).json({ success: false, message: "Error sending message" });
    }
};

const getUserChats = async (req, res) => {
    try {
        const userId = req.user.id;
        const chats = await Chat.find({ userId, paymentStatus: true}).populate('doctorId', 'name image speciality').sort({ updatedAt: -1 });
        res.json({ success: true, chats });
    } catch (error) {
        console.error("Chat history error:", error);
        res.status(500).json({ success: false, message: "Error fetching chats" });
    }
};
const getSingleChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;
        const chat = await Chat.findOne({ _id: chatId, userId: userId })
            .populate('doctorId', 'name image speciality');
        
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found." });
        }
        res.json({ success: true, chat });
    } catch (error) {
        console.error("Get single chat error:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


const requestUserRegistrationOTP = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing Details' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Check if a VERIFIED user with this email already exists
        const existingUser = await userModel.findOne({ email, isVerified: true });
        if (existingUser) {
            return res.json({ success: false, message: "User with this email already exists." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp, salt);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create or update the unverified user record
        await userModel.findOneAndUpdate(
            { email, isVerified: false },
            { name, email, password: hashedPassword, otp: hashedOTP, otpExpires, isVerified: false },
            { upsert: true, new: true }
        );

        // Send OTP to user's email
        const message = `<p>Your OTP for HealthLife registration is: <h2><b>${otp}</b></h2> This is valid for 10 minutes.</p>`;
        await sendEmail({ email, subject: 'HealthLife - Email Verification', message });

        res.json({ success: true, message: "OTP sent to your email. Please verify." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error sending OTP." });
    }
};

const verifyUserOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Signup process not initiated for this email." });
        }
        if (user.isVerified) {
            return res.json({ success: false, message: "This email is already verified." });
        }
        if (user.otpExpires < new Date()) {
            return res.json({ success: false, message: "OTP has expired. Please try signing up again." });
        }

        const isMatch = await bcrypt.compare(otp, user.otp);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid OTP." });
        }

        // Verification successful
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        
        // You can optionally generate a token here if you want to auto-login,
        // but as per your last request, we will not.
        res.json({ success: true, message: "Email verified successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error during verification." });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// === Final Export List ===
export {
    loginUser,
    requestUserRegistrationOTP, 
    verifyUserOTP, 
    getProfile,
    updateProfile,
    startChat,
    getUserChats,
    sendChatMessage,
    getSingleChat
};

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email"
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to user
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP via email
        const emailSubject = "Password Reset OTP";
        const emailBody = `
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password.</p>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `;

        await sendEmail(user.email, emailSubject, emailBody);

        res.status(200).json({
            success: true,
            message: "Password reset OTP sent to your email"
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send password reset OTP"
        });
    }
};

// Reset Password - Verify OTP and update password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP, and new password are required"
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email"
            });
        }

        // Check if OTP is valid and not expired
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.otpExpires < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update password and clear OTP
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset password"
        });
    }
};