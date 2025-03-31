import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define interfaces for the JWT payload
interface UserJwtPayload {
  id: number;
  email: string;
  type: 'user';
}

interface CompanyJwtPayload {
  id: number;
  email: string;
  type: 'company';
}

type JwtPayload = UserJwtPayload | CompanyJwtPayload;

// Extend Express Request interface to include user and company properties
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
      company?: {
        id: number;
        email: string;
      };
      isUser?: boolean;
      isCompany?: boolean;
    }
  }
}

// Generic authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login.',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_ACCESS_SECRET;
    
    if (!secret) {
      console.error('JWT_ACCESS_SECRET is not defined in the environment variables');
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      
      if (decoded.type === 'user') {
        req.user = {
          id: decoded.id,
          email: decoded.email
        };
        req.isUser = true;
        req.isCompany = false;
      } else if (decoded.type === 'company') {
        req.company = {
          id: decoded.id,
          email: decoded.email
        };
        req.isUser = false;
        req.isCompany = true;
      }
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.',
        error: 'INVALID_TOKEN'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during authentication.',
      error: 'AUTHENTICATION_ERROR'
    });
  }
};

// Middleware to authenticate users only
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  authenticate(req, res, () => {
    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden. User authentication required.',
        error: 'USER_ACCESS_REQUIRED'
      });
    }
    next();
  });
};

// Middleware to authenticate companies only
export const authenticateCompany = async (req: Request, res: Response, next: NextFunction) => {
  authenticate(req, res, () => {
    if (!req.company) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden. Company authentication required.',
        error: 'COMPANY_ACCESS_REQUIRED'
      });
    }
    next();
  });
}; 