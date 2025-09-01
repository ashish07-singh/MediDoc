import express from 'express';
import { loginUser, getProfile, updateProfile, requestUserRegistrationOTP, verifyUserOTP, forgotPassword, resetPassword } from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';

const router = express.Router();

// Public routes
router.post('/register/request-otp', requestUserRegistrationOTP);
router.post('/register/verify-otp', verifyUserOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', authUser, getProfile);
router.put('/profile', authUser, updateProfile);

export default router;