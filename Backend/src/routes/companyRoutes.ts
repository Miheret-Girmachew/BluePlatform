import { Router } from 'express';
import { CompanyController } from '../controllers/companyController';

const router = Router();
const companyController = new CompanyController();

// Register a new company
router.post('/register', companyController.register);

// Get company by ID
router.get('/:id', companyController.getCompanyById);

// Update company profile
router.put('/:id', companyController.updateCompany);

// Get company's jobs
router.get('/:id/jobs', companyController.getCompanyJobs);

// Create a new company
router.post('/', companyController.createCompany);

// Get company by name
router.get('/name/:name', companyController.getCompanyByName);

// Delete company
router.delete('/:id', companyController.deleteCompany);

// Get all companies
router.get('/', companyController.getAllCompanies);

// Get companies by size
router.get('/size/:size', companyController.getCompaniesBySize);

// Get companies by industry
router.get('/industry/:industry', companyController.getCompaniesByIndustry);

// Update company logo
router.put('/:id/logo', companyController.updateCompanyLogo);

// Get company's active jobs
router.get('/:id/active-jobs', companyController.getCompanyActiveJobs);

// Get company's job applications
router.get('/:id/applications', companyController.getCompanyJobApplications);

export default router;
