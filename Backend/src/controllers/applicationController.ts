import { Request, Response } from 'express';
import { ApplicationService } from '../services/applicationService';
import {
  ResourceNotFoundError,
  ForbiddenError,
  ValidationError,
  DatabaseError
} from '../utils/errors';

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    userId?: number;
    companyId?: number;
  };
}

export class ApplicationController {
  private applicationService: ApplicationService;

  constructor() {
    this.applicationService = new ApplicationService();
  }

  // Apply for a job
  applyForJob = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { jobId } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      const applicationData = req.body as { coverLetter?: string; resumeUrl?: string };
      
      const application = await ApplicationService.applyForJob(userId.toString(), jobId, applicationData);
      return res.status(201).json(application);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return res.status(404).json({ error: error.message });
      } else if (error instanceof ForbiddenError) {
        return res.status(403).json({ error: error.message });
      } else if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  };

  // Get applications
  getApplications = async (req: Request, res: Response) => {
    try {
      const { userType, entityId } = req.params;
      const { status } = req.query;
      
      const applications = await ApplicationService.getApplications(
        userType as 'user' | 'company',
        entityId,
        status ? { status: status as any } : undefined
      );
      
      res.json(applications);
    } catch (error) {
      if (error instanceof DatabaseError) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  };

  // Get application by ID
  getApplicationById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { userType, entityId } = req.query;
      
      const application = await ApplicationService.getApplicationById(
        id,
        entityId as string,
        userType as 'user' | 'company'
      );
      
      res.json(application);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof ForbiddenError) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  };

  // Update application status
  updateApplicationStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;
      if (!companyId) {
        return res.status(400).json({ error: 'Company ID is required' });
      }
      const { status } = req.body;
      
      const application = await ApplicationService.updateApplicationStatus(id, companyId.toString(), status);
      return res.json(application);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return res.status(404).json({ error: error.message });
      } else if (error instanceof ForbiddenError) {
        return res.status(403).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  };

  // Withdraw application
  withdrawApplication = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      const result = await ApplicationService.withdrawApplication(id, userId.toString());
      return res.json(result);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return res.status(404).json({ error: error.message });
      } else if (error instanceof ForbiddenError) {
        return res.status(403).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  };

  // Get job applications
  getJobApplications = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const applications = await this.applicationService.getJobApplications(jobId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };

  // Get company applications
  getCompanyApplications = async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const applications = await this.applicationService.getCompanyApplications(companyId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };

  // Get applications by status
  getApplicationsByStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.params;
      const applications = await this.applicationService.getApplicationsByStatus(status as any);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };

  // Get application statistics
  getApplicationStatistics = async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const statistics = await this.applicationService.getApplicationStatistics(companyId);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };
} 