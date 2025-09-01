import express from 'express';
import { requestDoctorRegistrationOTP, verifyDoctorOTP, loginDoctor, getDoctorProfile, updateDoctorProfile, forgotPassword, resetPassword, doctorList, doctorProfile } from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';

const router = express.Router();

// Public routes
router.post('/register/request-otp', requestDoctorRegistrationOTP);
router.post('/register/verify-otp', verifyDoctorOTP);
router.post('/login', loginDoctor);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/list', doctorList); // Public route to get all doctors
router.get('/profile/:id', doctorProfile); // Public route to get doctor profile by ID

// Protected routes
router.get('/profile', authDoctor, getDoctorProfile);
router.put('/profile', authDoctor, updateDoctorProfile);

export default router;