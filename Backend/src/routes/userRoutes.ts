import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

// Register a new user
router.post('/register', userController.register as any);

// Get user by ID
router.get('/:id', userController.getUserById as any);

// Update user profile
router.put('/:id', userController.updateUser as any);

// Upload resume
router.put('/:id/resume', userController.uploadResume as any);

// Upload portfolio
router.put('/:id/portfolio', userController.uploadPortfolio as any);

// Update skills
router.put('/:id/skills', userController.updateSkills as any);

// Get all students
router.get('/students', userController.getAllStudents as any);

// Get all graduates
router.get('/graduates', userController.getAllGraduates as any);

// Update user preferences
router.put('/:id/preferences', userController.updatePreferences as any);

export default router;



