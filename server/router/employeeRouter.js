import express from 'express';
import { 
    addEmployee, 
    getAllEmployees, 
    getEmployeeById, 
    updateEmployee, 
    deleteEmployee 
} from '../controller/employeeController.js';
import { protect } from '../middleware/protect.js';
import multer from 'multer';

const route = express.Router();
const upload=multer()

// Add Employee
route.post('/add_employee',protect,upload.none(), addEmployee);

// Get All Employees
route.get('/find_employees',protect, getAllEmployees);

// Get Employee by ID
route.get('/employee_by_id/:id',protect, getEmployeeById);

// Update Employee
route.put('/update_employee/:id',protect,upload.none(), updateEmployee);

// Delete Employee
route.delete('/delete_employee/:id',protect, deleteEmployee);

export default route;
