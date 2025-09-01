import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, requestOTP, verifyOTP, forgotPassword, resetPassword } from '../controllers/userController.js';
import { authUser } from '../middleware/authUser.js';

const router = express.Router();

// Public routes
router.post('/register/request-otp', requestOTP);
router.post('/register/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', authUser, getUserProfile);
router.put('/profile', authUser, updateUserProfile);

export default router;