import express from 'express';
import { loginAdmin, adminDashboard, allDoctors, getChatSessions, forgotPassword, resetPassword } from '../controllers/adminController.js';
import authAdmin from '../middleware/authAdmin.js';

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/dashboard', authAdmin, adminDashboard);
router.get('/doctors', authAdmin, allDoctors);
router.get('/consultations', authAdmin, getChatSessions);

export default router;