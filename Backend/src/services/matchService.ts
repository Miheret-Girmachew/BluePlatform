import { PrismaClient, JobType, Match } from '@prisma/client';
import { 
  ResourceNotFoundError,
  DatabaseError 
} from '../utils/errors';
import { CreateMatchDto} from '../types/match.types';

const prisma = new PrismaClient();

export class MatchService {
  // Create a new match
  async createMatch(data: CreateMatchDto): Promise<Match> {
    // Calculate match factors
    const matchFactors = {
      skillsMatch: 0,
      jobTypeMatch: 0,
      locationMatch: 0,
      salaryMatch: 0,
      remoteMatch: 0
    };

    // Get user and job details
    const [user, job] = await Promise.all([
      prisma.user.findUnique({
        where: { id: data.userId },
        select: {
          skills: true,
          preferredJobTypes: true,
          preferredLocations: true,
          minSalary: true,
          remotePreference: true,
        },
      }),
      prisma.job.findUnique({
        where: { id: data.jobId },
        select: {
          requirements: true,
          jobType: true,
          location: true,
          salary: true,
        },
      }),
    ]);

    if (!user || !job) {
      throw new ResourceNotFoundError('User or job not found');
    }

    // Calculate match factors
    // Skills match
    const commonSkills = user.skills.filter(skill => 
      job.requirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
    );
    matchFactors.skillsMatch = commonSkills.length / job.requirements.length;

    // Job type match
    matchFactors.jobTypeMatch = user.preferredJobTypes.includes(job.jobType) ? 1 : 0;

    // Location match
    matchFactors.locationMatch = user.preferredLocations.includes(job.location) ? 1 : 0;

    // Salary match
    if (user.minSalary && job.salary) {
      const jobSalary = parseInt(job.salary);
      if (!isNaN(jobSalary) && jobSalary >= user.minSalary) {
        matchFactors.salaryMatch = 1;
      }
    }

    // Remote match
    if (user.remotePreference) {
      matchFactors.remoteMatch = 1;
    }

    return prisma.match.create({
      data: {
        ...data,
        matchFactors,
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
        user: true,
      },
    });
  }

  // Get match by ID
  async getMatchById(id: string): Promise<Match | null> {
    return prisma.match.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            company: true,
          },
        },
        user: true,
      },
    });
  }

  // Update match score
  async updateMatchScore(id: string, score: number): Promise<Match> {
    return prisma.match.update({
      where: { id },
      data: { score },
      include: {
        job: {
          include: {
            company: true,
          },
        },
        user: true,
      },
    });
  }

  // Delete match
  async deleteMatch(id: string): Promise<Match> {
    return prisma.match.delete({
      where: { id },
    });
  }

  // Get all matches for a user
  async getUserMatches(userId: string): Promise<Match[]> {
    return prisma.match.findMany({
      where: {
        userId,
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
    });
  }

  // Get all matches for a job
  async getJobMatches(jobId: string): Promise<Match[]> {
    return prisma.match.findMany({
      where: {
        jobId,
      },
      include: {
        user: true,
      },
      orderBy: {
        score: 'desc',
      },
    });
  }

  // Get all matches for a company
  async getCompanyMatches(companyId: string): Promise<Match[]> {
    return prisma.match.findMany({
      where: {
        job: {
          companyId,
        },
      },
      include: {
        job: true,
        user: true,
      },
      orderBy: {
        score: 'desc',
      },
    });
  }

  // Get top matches for a user
  async getTopMatchesForUser(userId: string, limit: number = 10): Promise<Match[]> {
    return prisma.match.findMany({
      where: {
        userId,
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
      take: limit,
    });
  }

  // Get top matches for a job
  async getTopMatchesForJob(jobId: string, limit: number = 10): Promise<Match[]> {
    return prisma.match.findMany({
      where: {
        jobId,
      },
      include: {
        user: true,
      },
      orderBy: {
        score: 'desc',
      },
      take: limit,
    });
  }

  // Calculate match score between user and job
  async calculateMatchScore(userId: string, jobId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        skills: true,
        preferredJobTypes: true,
        preferredIndustries: true,
        preferredLocations: true,
        minSalary: true,
        remotePreference: true,
      },
    });

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        requirements: true,
        jobType: true,
        location: true,
        salary: true,
      },
    });

    if (!user || !job) {
      throw new Error('User or job not found');
    }

    let score = 0;
    const weights = {
      skills: 0.4,
      jobType: 0.2,
      location: 0.2,
      salary: 0.1,
      remote: 0.1,
    };

    // Skills match
    const commonSkills = user.skills.filter(skill => 
      job.requirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
    );
    score += (commonSkills.length / job.requirements.length) * weights.skills;

    // Job type match
    if (user.preferredJobTypes.includes(job.jobType)) {
      score += weights.jobType;
    }

    // Location match
    if (user.preferredLocations.includes(job.location)) {
      score += weights.location;
    }

    // Salary match
    if (user.minSalary && job.salary) {
      const jobSalary = parseInt(job.salary);
      if (!isNaN(jobSalary) && jobSalary >= user.minSalary) {
        score += weights.salary;
      }
    }

    return Math.round(score * 100); // Convert to percentage
  }

  static async getJobRecommendationsForUser(userId: string, limit: number = 10) {
    try {
      // Get user details with skills
      const user = await prisma.user.findUnique({ 
        where: { id: userId },
        select: {
          id: true,
          skills: true,
          university: true,
        }
      });

      if (!user) {
        throw new ResourceNotFoundError(`User with ID ${userId} not found.`);
      }

      // Get open jobs
      const allOpenJobs = await prisma.job.findMany({
        where: {
          isActive: true,
          applications: {
            // Exclude jobs the user has already applied for
            none: {
              applicantId: userId
            }
          }
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              industry: true,
              location: true
            }
          }
        }
      });

      // If user has no skills, return random open jobs
      if (!user.skills || user.skills.length === 0) {
        return allOpenJobs.slice(0, limit);
      }

      // Calculate job relevance scores based on skills match
      const scoredJobs = allOpenJobs.map(job => {
        let score = 0;
        const jobKeywords = [
          ...(job.requirements?.flatMap(req => req.toLowerCase().split(/[\s,;]+/)) || []),
          ...(job.description?.toLowerCase().split(/[\s,;]+/) || []),
          ...(job.title?.toLowerCase().split(/[\s,;]+/) || [])
        ];

        // Score based on skills match
        for (const skill of user.skills) {
          if (jobKeywords.some(keyword => keyword.includes(skill.toLowerCase()))) {
            score += 10;
          }
        }

        // Bonus for internships for students
        if (job.jobType === JobType.INTERNSHIP && user.university) {
          score += 5;
        }

        return { job, score };
      });

      // Sort by score (descending) and return top results
      return scoredJobs
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.job);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new DatabaseError('An error occurred while retrieving job recommendations. Please try again later.');
    }
  }

  static async getCandidateRecommendationsForJob(jobId: string, companyId: string, limit: number = 10) {
    try {
      // Check if job exists and belongs to company
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: {
          id: true,
          companyId: true,
          title: true,
          requirements: true,
          description: true
        }
      });

      if (!job) {
        throw new ResourceNotFoundError(`Job with ID ${jobId} not found.`);
      }

      if (job.companyId !== companyId) {
        throw new ResourceNotFoundError('You do not have permission to access this job.');
      }

      // Extract keywords from job description and requirements
      const jobKeywords = [
        ...(job.requirements?.flatMap(req => req.toLowerCase().split(/[\s,;]+/)) || []),
        ...(job.description?.toLowerCase().split(/[\s,;]+/) || []),
        ...(job.title?.toLowerCase().split(/[\s,;]+/) || [])
      ];

      // Get all users who haven't applied to this job yet
      const users = await prisma.user.findMany({
        where: {
          applications: {
            none: {
              jobId
            }
          }
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          skills: true,
          university: true,
          resume: true,
        }
      });

      // Score candidates based on skill match
      const scoredCandidates = users.map(user => {
        let score = 0;

        // Score based on skills match
        if (user.skills && user.skills.length > 0) {
          for (const skill of user.skills) {
            if (jobKeywords.some(keyword => keyword.includes(skill.toLowerCase()))) {
              score += 10;
            }
          }
        }

        // Bonus for having a resume and portfolio
        if (user.resume) score += 5;

        return { user, score };
      });

      // Sort by score (descending) and return top results
      return scoredCandidates
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.user);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new DatabaseError('An error occurred while retrieving candidate recommendations. Please try again later.');
    }
  }
} 