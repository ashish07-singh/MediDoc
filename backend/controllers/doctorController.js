import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import Chat from "../models/Chat.js";
import sendEmail from "../utils/sendEmail.js";
import { uploadToCloudinary } from "../middleware/multer.js";

// --- Doctor Registration: Step 1 ---
// Handles initial signup request and sends an OTP to the doctor's email.
const requestDoctorRegistrationOTP = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('Registration request for:', { name, email, passwordLength: password?.length });

        // Check if a VERIFIED doctor with this email already exists
        const existingDoctor = await doctorModel.findOne({ email, isVerified: true });
        if (existingDoctor) {
            console.log('Verified doctor already exists:', email);
            return res.json({ success: false, message: "Doctor with this email already exists." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp, salt);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        console.log('Password hashing completed:', {
            originalPasswordLength: password?.length,
            hashedPasswordLength: hashedPassword?.length,
            salt: salt
        });

        // Create or update the unverified doctor record. The profileStatus defaults to 'incomplete'.
        const doctorRecord = await doctorModel.findOneAndUpdate(
            { email, isVerified: false },
            { name, email, password: hashedPassword, otp: hashedOTP, otpExpires, isVerified: false },
            { upsert: true, new: true }
        );

        console.log('Doctor record created/updated:', {
            id: doctorRecord._id,
            email: doctorRecord.email,
            hasPassword: !!doctorRecord.password,
            isVerified: doctorRecord.isVerified
        });

        const message = `<p>Your One-Time Password (OTP) for HealthLife registration is:</p><h2><b>${otp}</b></h2><p>This OTP is valid for 10 minutes.</p>`;
        
        await sendEmail({
            email: email,
            subject: 'HealthLife - Verify Your Email',
            message
        });

        res.json({ success: true, message: "OTP sent to your email. Please verify." });

    } catch (error) {
        console.log('Registration error:', error);
        res.status(500).json({ success: false, message: "Error sending OTP." });
    }
};

// --- Doctor Registration: Step 2 ---
// Verifies the OTP and finalizes the account creation without logging in.
const verifyDoctorOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        console.log('OTP verification attempt for:', email);
        console.log('OTP received:', otp);
        
        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
            console.log('No doctor found for OTP verification:', email);
            return res.json({ success: false, message: "Signup process not initiated for this email." });
        }
        
        if (doctor.isVerified) {
            console.log('Doctor already verified:', email);
            return res.json({ success: false, message: "This email is already verified." });
        }
        
        if (doctor.otpExpires < new Date()) {
            console.log('OTP expired for:', email);
            return res.json({ success: false, message: "OTP has expired. Please try signing up again." });
        }

        console.log('Doctor found for verification:', {
            id: doctor._id,
            email: doctor.email,
            hasOTP: !!doctor.otp,
            hasPassword: !!doctor.password,
            isVerified: doctor.isVerified
        });

        const isMatch = await bcrypt.compare(otp, doctor.otp);
        console.log('OTP match result:', isMatch);
        
        if (!isMatch) {
            console.log('Invalid OTP for:', email);
            return res.json({ success: false, message: "Invalid OTP." });
        }

        // Verification successful: update the doctor's record
        doctor.isVerified = true;
        doctor.otp = undefined;
        doctor.otpExpires = undefined;
        await doctor.save();
        
        console.log('Doctor verification successful:', email);
        
        // --- FIX: Do not return a token. Prompt user to log in. ---
        res.json({ success: true, message: "Email verified successfully! Please log in to continue." });

    } catch (error) {
        console.log('OTP verification error:', error);
        res.status(500).json({ success: false, message: "Error during verification." });
    }
};

// --- Doctor Login ---
// Handles login and checks if the doctor's profile is complete.
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login attempt for email:', email);
        console.log('Password received:', password);
        
        // --- FIX: Fetch profileStatus and isVerified to check them ---
        const user = await doctorModel.findOne({ email }).select('+password +profileStatus +isVerified');

        if (!user) {
            console.log('No user found with email:', email);
            return res.json({ success: false, message: "Invalid credentials" });
        }

        console.log('User found:', { 
            id: user._id, 
            email: user.email, 
            isVerified: user.isVerified, 
            profileStatus: user.profileStatus,
            hasPassword: !!user.password 
        });

        // --- FIX: Add check to ensure email has been verified via OTP ---
        if (!user.isVerified) {
            console.log('User not verified:', email);
            return res.json({ success: false, message: "Please verify your email before logging in." });
        }

        console.log('Comparing passwords...');
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);
        
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            console.log('Login successful for:', email);
            // --- FIX: Send profileStatus to the frontend for redirection logic ---
            res.json({ success: true, token, profileStatus: user.profileStatus });
        } else {
            console.log('Password mismatch for:', email);
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// --- Update Doctor Profile ---
// Handles profile updates and marks the profile as 'complete'.
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.doctor.id;
        const { speciality, degree, experience, about, available } = req.body;

        let updateFields = { speciality, degree, experience, about, available };

        // --- FIX: When the profile is updated, mark it as complete. ---
        // This stops the forced redirect to the profile page on subsequent logins.
        updateFields.profileStatus = 'complete';

        if (req.file) {
            console.log('File received for upload:', {
                filename: req.file.filename,
                path: req.file.path,
                mimetype: req.file.mimetype,
                size: req.file.size
            });
            
            const imageUrl = await uploadToCloudinary(req.file);
            console.log('Image uploaded to Cloudinary:', imageUrl);
            updateFields.image = imageUrl;
        } else {
            console.log('No file received for upload');
        }

        const updatedDoctor = await doctorModel.findByIdAndUpdate(docId, 
            updateFields,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: "Doctor not found." });
        }

        res.json({ success: true, message: 'Profile Updated Successfully', profileData: updatedDoctor });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


// === All other controller functions remain the same ===

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
        res.json({ success: true, message: 'Availability Changed' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const doctorProfile = async (req, res) => {
    try {
        const docId = req.doctor.id;
        const profileData = await doctorModel.findById(docId).select('-password');
        if (!profileData) {
            return res.status(404).json({ success: false, message: "Doctor profile not found." });
        }
        res.json({ success: true, profileData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const doctorDashboard = async (req, res) => {
    try {
        const doctorId = req.doctor.id;
        const allPaidChats = await Chat.find({ doctorId: doctorId, paymentStatus: true });
        const totalEarnings = allPaidChats.reduce((sum, chat) => sum + (chat.amount || 0), 0);
        const patientIds = new Set(allPaidChats.map(chat => chat.userId.toString()));
        const totalPatients = patientIds.size;
        const activeChatCount = await Chat.countDocuments({ doctorId: doctorId, paymentStatus: true, expiresAt: { $gt: new Date() } });
        const dashData = { earnings: totalEarnings, activeChats: activeChatCount, totalPatients: totalPatients, latestChats: allPaidChats.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5) };
        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const getDoctorChats = async (req, res) => {
    try {
        const doctorId = req.doctor.id;
        const chats = await Chat.find({ doctorId: doctorId, paymentStatus: true }).populate('userId', 'name email image').sort({ updatedAt: -1 });
        res.json({ success: true, chats });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const getSingleDoctorChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const doctorId = req.doctor.id;
        const chat = await Chat.findOne({ _id: chatId, doctorId: doctorId }).populate('userId', 'name email image').populate('doctorId', 'name speciality image');
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found or access denied." });
        }
        res.json({ success: true, chat });
    } catch (error) {
        console.error("Error fetching single doctor chat:", error);
        res.status(500).json({ success: false, message: "Failed to fetch chat." });
    }
};

const doctorReplyToChat = async (req, res) => {
    try {
        const { chatId, text } = req.body;
        const doctorId = req.doctor.id; 
        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, message: "Reply cannot be empty." });
        }
        const chat = await Chat.findOne({ _id: chatId, doctorId: doctorId });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat session not found or access denied." });
        }
        chat.messages.push({ sender: 'doctor', text: text, createdAt: new Date() });
        await chat.save();
        res.json({ success: true, message: "Reply sent successfully.", chat });
    } catch (error) {
        console.error("Doctor reply error:", error);
        res.status(500).json({ success: false, message: "Error sending reply." });
    }
};

// --- Updated Export List ---
export {
    requestDoctorRegistrationOTP,
    verifyDoctorOTP,
    loginDoctor,
    doctorList,
    changeAvailablity,
    doctorProfile,
    updateDoctorProfile,
    getDoctorChats,
    doctorDashboard,
    doctorReplyToChat,
    getSingleDoctorChat,
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

        // Check if doctor exists
        const doctor = await doctorModel.findOne({ email });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found with this email"
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to doctor
        doctor.otp = otp;
        doctor.otpExpires = otpExpires;
        await doctor.save();

        // Send OTP via email
        const emailSubject = "Password Reset OTP";
        const emailBody = `
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password.</p>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `;

        await sendEmail(doctor.email, emailSubject, emailBody);

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

        // Check if doctor exists
        const doctor = await doctorModel.findOne({ email });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found with this email"
            });
        }

        // Check if OTP is valid and not expired
        if (doctor.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (doctor.otpExpires < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update password and clear OTP
        doctor.password = hashedPassword;
        doctor.otp = undefined;
        doctor.otpExpires = undefined;
        await doctor.save();

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