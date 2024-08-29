// routes/employeeRoutes.js
import express from 'express';
import multer from 'multer';
import Employee from '../models/Employee.js'; // Adjust path as necessary

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Add employee route
router.post('/employee', upload.single('image'), async (req, res) => {
  try {
    const { name, email, password, address, salary, id } = req.body;
    const image = req.file ? req.file.path : null;

    // Create new employee
    const newEmployee = new Employee({
      name,
      email,
      password,
      address,
      salary,
      image,
      id,
    });

    await newEmployee.save();
    res.status(201).json({ Status: 'Success', Message: 'Employee added successfully!' });
  } catch (error) {
    console.error('Error adding employee:', error.message);
    res.status(400).json({ Status: 'Failure', Message: 'Failed to add employee. ' + error.message });
  }
});

// Get all employees route
router.get('/getEmployee', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({ Status: 'Success', Data: employees });
  } catch (error) {
    res.status(500).json({ Status: 'Failure', Message: error.message });
  }
});

export default router;
