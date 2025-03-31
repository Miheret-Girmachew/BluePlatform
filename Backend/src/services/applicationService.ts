import { PrismaClient, Application, ApplicationStatus } from '@prisma/client';
import { 
  ResourceNotFoundError,
  ForbiddenError,
  DuplicateResourceError,
  DatabaseError 
} from '../utils/errors';
import { CreateApplicationDto } from '../types/application.types';

const prisma = new PrismaClient();

export class ApplicationService {
  static async applyForJob(applicantId: string, jobId: string, applicationData: {
    coverLetter?: string;
    resumeUrl?: string;
  }) {
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({ where: { id: applicantId } });
      if (!user) {
        throw new ResourceNotFoundError(`User with ID ${applicantId} not found.`);
      }

      // Check if job exists and is active
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) {
        throw new ResourceNotFoundError(`Job with ID ${jobId} not found.`);
      }
      
      if (!job.isActive) {
        throw new ForbiddenError('This job is no longer accepting applications.');
      }

      // Check if user has already applied for this job
      const existingApplication = await prisma.application.findFirst({
        where: {
          applicantId,
          jobId
        }
      });

      if (existingApplication) {
        throw new DuplicateResourceError('You have already applied for this job.');
      }

      // Create application
      const application = await prisma.application.create({
        data: {
          applicantId,
          jobId,
          status: ApplicationStatus.PENDING,
          coverLetter: applicationData.coverLetter,
          resumeUrl: applicationData.resumeUrl || user.resume
        },
        include: {
          job: {
            select: {
              title: true,
              company: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      return application;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new DatabaseError('An error occurred while submitting your application. Please try again later.');
    }
  }

  static async getApplications(
    userType: 'user' | 'company', 
    entityId: string, 
    filters?: { 
      status?: ApplicationStatus 
    }
  ) {
    try {
      // Build the where clause based on user type
      const where: any = {};
      
      if (userType === 'user') {
        where.applicantId = entityId;
      } else if (userType === 'company') {
        where.job = {
          companyId: entityId
        };
      }

      // Add status filter if provided
      if (filters?.status) {
        where.status = filters.status;
      }

      // Get applications with necessary relations
      const applications = await prisma.application.findMany({
        where,
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          applicant: {
            select: {
              id: true,
              fullName: true,
              email: true,
              skills: true,
              university: true
            }
          }
        },
        orderBy: { appliedAt: 'desc' }
      });

      return applications;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new DatabaseError('An error occurred while retrieving applications. Please try again later.');
    }
  }

  static async getApplicationById(applicationId: string, entityId: string, entityType: 'user' | 'company') {
    try {
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                }
              }
            }
          },
          applicant: {
            select: {
              id: true,
              fullName: true,
              email: true,
              skills: true,
              university: true,
              resume: true,
            }
          }
        }
      });

      if (!application) {
        throw new ResourceNotFoundError(`Application with ID ${applicationId} not found.`);
      }

      // Check authorization - only the applicant or the company that posted the job can see it
      if (
        (entityType === 'user' && application.applicantId !== entityId) || 
        (entityType === 'company' && application.job.company.id !== entityId)
      ) {
        throw new ForbiddenError('You do not have permission to view this application.');
      }

      return application;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new DatabaseError('An error occurred while retrieving the application details. Please try again later.');
    }
  }

  static async updateApplicationStatus(applicationId: string, companyId: string, status: ApplicationStatus) {
    try {
      // Check if application exists
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: {
            select: {
              companyId: true
            }
          }
        }
      });

      if (!application) {
        throw new ResourceNotFoundError(`Application with ID ${applicationId} not found.`);
      }

      // Check if the company owns the job
      if (application.job.companyId !== companyId) {
        throw new ForbiddenError('You do not have permission to update this application.');
      }

      // Update application status
      const updatedApplication = await prisma.application.update({
        where: { id: applicationId },
        data: { status },
        include: {
          applicant: {
            select: {
              fullName: true,
              email: true
            }
          },
          job: {
            select: {
              title: true
            }
          }
        }
      });

      return updatedApplication;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new DatabaseError('An error occurred while updating the application status. Please try again later.');
    }
  }

  static async withdrawApplication(applicationId: string, applicantId: string) {
    try {
      // Check if application exists
      const application = await prisma.application.findUnique({
        where: { id: applicationId }
      });

      if (!application) {
        throw new ResourceNotFoundError(`Application with ID ${applicationId} not found.`);
      }

      // Check if the user is the applicant
      if (application.applicantId !== applicantId) {
        throw new ForbiddenError('You do not have permission to withdraw this application.');
      }

      // Delete application
      await prisma.application.delete({
        where: { id: applicationId }
      });

      return {
        success: true,
        message: 'Application has been withdrawn successfully.'
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new DatabaseError('An error occurred while withdrawing the application. Please try again later.');
    }
  }

  // Create a new application
  async createApplication(data: CreateApplicationDto): Promise<Application> {
    return prisma.application.create({
      data: {
        applicantId: data.userId,
        jobId: data.jobId,
        status: data.status ?? ApplicationStatus.PENDING,
        coverLetter: data.coverLetter,
        resumeUrl: data.resumeUrl,
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
        applicant: true,
      },
    });
  }

  // Get application by ID
  async getApplicationById(id: string): Promise<Application | null> {
    return prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            company: true,
          },
        },
        applicant: true,
      },
    });
  }

  // Update application status
  async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<Application> {
    return prisma.application.update({
      where: { id },
      data: { status },
      include: {
        job: {
          include: {
            company: true,
          },
        },
        applicant: true,
      },
    });
  }

  // Delete application
  async deleteApplication(id: string): Promise<Application> {
    return prisma.application.delete({
      where: { id },
    });
  }

  // Get all applications for a user
  async getUserApplications(applicantId: string): Promise<Application[]> {
    return prisma.application.findMany({
      where: {
        applicantId,
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  // Get all applications for a job
  async getJobApplications(jobId: string): Promise<Application[]> {
    return prisma.application.findMany({
      where: {
        jobId,
      },
      include: {
        applicant: true,
      },
    });
  }

  // Get all applications for a company
  async getCompanyApplications(companyId: string): Promise<Application[]> {
    return prisma.application.findMany({
      where: {
        job: {
          companyId,
        },
      },
      include: {
        job: true,
        applicant: true,
      },
    });
  }

  // Get applications by status
  async getApplicationsByStatus(status: ApplicationStatus): Promise<Application[]> {
    return prisma.application.findMany({
      where: {
        status,
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
        applicant: true,
      },
    });
  }

  // Check if user has already applied to a job
  async hasUserApplied(applicantId: string, jobId: string): Promise<boolean> {
    const application = await prisma.application.findFirst({
      where: {
        applicantId,
        jobId,
      },
    });

    return !!application;
  }

  // Get application statistics
  async getApplicationStatistics(companyId: string) {
    const applications = await prisma.application.findMany({
      where: {
        job: {
          companyId,
        },
      },
      select: {
        status: true,
      },
    });

    const total = applications.length;
    const statusCounts = applications.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    return {
      total,
      statusCounts,
    };
  }
} 