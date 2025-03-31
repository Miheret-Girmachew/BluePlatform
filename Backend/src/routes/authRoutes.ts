import express from 'express';
import { AuthController } from '../controllers/authController';
import { RequestHandler } from 'express';

const router = express.Router();

// User registration
router.post('/register', AuthController.register as RequestHandler);

// User login
router.post('/login', AuthController.login as RequestHandler);

// User logout
router.post('/logout', AuthController.logout as RequestHandler);

// Get current user/company details
router.get('/me', AuthController.getCurrentUser as RequestHandler);

export default router;
