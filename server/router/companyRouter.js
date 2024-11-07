import express from 'express';
import { addCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany } from '../controller/companyController.js';
import multer from 'multer'
import { protect } from '../middleware/protect.js';


const route = express.Router();

const upload=multer()
// Create: Add a new company
route.post('/add_company',protect,upload.array('imageUrl'), addCompany);

// Read: Get all companies
route.get('/all_company',protect, getAllCompanies);

// Read: Get a company by ID
route.get('/company_by_id/:id',protect, getCompanyById);

// Update: Update a company by ID
route.put('/update_company/:id',protect,upload.array('imageUrl'), updateCompany);

// Delete: Delete a company by ID
route.delete('/delete_company/:id',protect, deleteCompany);

export default route;
