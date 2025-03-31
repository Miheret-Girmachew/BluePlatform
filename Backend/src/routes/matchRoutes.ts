import { Router } from 'express';
import { MatchController } from '../controllers/matchController';

const router = Router();
const matchController = new MatchController();

// Create a new match
router.post('/', matchController.createMatch);

// Get match by ID
router.get('/:id', matchController.getMatchById);

// Update match score
router.patch('/:id/score', matchController.updateMatchScore);

// Delete match
router.delete('/:id', matchController.deleteMatch);

// Get all matches for a user
router.get('/user/:userId', matchController.getUserMatches);

// Get all matches for a job
router.get('/job/:jobId', matchController.getJobMatches);

// Get all matches for a company
router.get('/company/:companyId', matchController.getCompanyMatches);

// Get top matches for a user
router.get('/user/:userId/top', matchController.getTopMatchesForUser);

// Get top matches for a job
router.get('/job/:jobId/top', matchController.getTopMatchesForJob);

// Calculate match score between user and job
router.get('/score/:userId/:jobId', matchController.calculateMatchScore);

// Get job recommendations for user
router.get('/recommendations/jobs/:userId', matchController.getJobRecommendations);

// Get candidate recommendations for job
router.get('/recommendations/candidates/:jobId/:companyId', matchController.getCandidateRecommendations);

export default router; 