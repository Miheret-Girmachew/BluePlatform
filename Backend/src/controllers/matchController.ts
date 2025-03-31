import { Request, Response } from 'express';
import { MatchService } from '../services/matchService';
import {
  ResourceNotFoundError,
  DatabaseError
} from '../utils/errors';

export class MatchController {
  private matchService: MatchService;

  constructor() {
    this.matchService = new MatchService();
  }

  // Create a new match
  createMatch = async (req: Request, res: Response) => {
    try {
      const match = await this.matchService.createMatch(req.body);
      res.status(201).json(match);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  };

  // Get match by ID
  getMatchById = async (req: Request, res: Response) => {
    try {
      const match = await this.matchService.getMatchById(req.params.id);
      if (!match) {
        res.status(404).json({ error: 'Match not found' });
      } else {
        res.json(match);
      }
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };

  // Update match score
  updateMatchScore = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { score } = req.body;
      const match = await this.matchService.updateMatchScore(id, score);
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };

  // Delete match
  deleteMatch = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const match = await this.matchService.deleteMatch(id);
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };

  // Get all matches for a user
  getUserMatches = async (req: Request, res: Response) => {
    try {
      const matches = await this.matchService.getUserMatches(req.params.userId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };

  // Get all matches for a job
  getJobMatches = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const matches = await this.matchService.getJobMatches(jobId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };

  // Get all matches for a company
  getCompanyMatches = async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const matches = await this.matchService.getCompanyMatches(companyId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };

  // Get top matches for a user
  getTopMatchesForUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const matches = await this.matchService.getTopMatchesForUser(userId, limit);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };

  // Get top matches for a job
  getTopMatchesForJob = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const matches = await this.matchService.getTopMatchesForJob(jobId, limit);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };

  // Calculate match score between user and job
  calculateMatchScore = async (req: Request, res: Response) => {
    try {
      const { userId, jobId } = req.params;
      const score = await this.matchService.calculateMatchScore(userId, jobId);
      res.json({ score });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  };

  // Get job recommendations for user
  getJobRecommendations = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recommendations = await MatchService.getJobRecommendationsForUser(req.params.userId, limit);
      res.json(recommendations);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof DatabaseError) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  };

  // Get candidate recommendations for job
  getCandidateRecommendations = async (req: Request, res: Response) => {
    try {
      const { jobId, companyId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const recommendations = await MatchService.getCandidateRecommendationsForJob(jobId, companyId, limit);
      res.json(recommendations);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof DatabaseError) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  };
}
