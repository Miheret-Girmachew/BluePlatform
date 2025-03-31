import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController';

const router = Router();
const applicationController = new ApplicationController();

// Apply for a job
router.post('/jobs/:jobId/apply', applicationController.applyForJob as any);

// Get applications by user type and entity ID
router.get('/:userType/:entityId', applicationController.getApplications);

// Get application by ID
router.get('/:id', applicationController.getApplicationById);

// Update application status
router.put('/:id/status', applicationController.updateApplicationStatus as any);

// Withdraw application
router.delete('/:id/withdraw', applicationController.withdrawApplication as any);

// Get job applications
router.get('/jobs/:jobId', applicationController.getJobApplications);

// Get company applications
router.get('/companies/:companyId', applicationController.getCompanyApplications);

// Get applications by status
router.get('/status/:status', applicationController.getApplicationsByStatus);

// Get application statistics
router.get('/statistics/:companyId', applicationController.getApplicationStatistics);

export default router;
