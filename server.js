import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employeeRoutes.js';
import candidateRouter from './models/Candidate.js'; // Ensure this import is correct
import leaveRoutes from './routes/leaveRequestRoutes.js'
import EmployeeRoutes from './routes/employeeRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const __dirname = path.resolve();

// Connect to MongoDB Atlas
connectDB();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://boisterous-bienenstitch-2fcc86.netlify.app'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization'
}));

app.use(cookieParser());
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Registration route
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, dob, phone, address } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      dob,
      phone,
      address,
    });

    await newUser.save();
    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(400).json({ message: 'Registration failed. ' + error.message });
  }
});

app.get('/api/adminCount', (req, res) => {
  // Implement the logic to get admin count
  res.json({ adminCount: 10 });
});

app.get('/api/employeeCount', (req, res) => {
  // Implement the logic to get employee count
  res.json({ employeeCount: 50 });
});

app.get('/api/salary', (req, res) => {
  // Implement the logic to get total salary
  res.json({ result: [{ sumOfSalary: 50000 }] });
});
// Leave request route
// app.post('/api/leave-requests', async (req, res) => {
//   try {
//     const leaveRequest = new LeaveRequest(req.body);
//     await leaveRequest.save();
//     res.status(201).json(leaveRequest);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });


// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  // Clear authentication cookie
  res.clearCookie('authToken'); // Adjust based on your cookie name
  res.status(200).send({ message: 'Logged out successfully' });
});

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api', leaveRoutes);
app.use('/api', candidateRouter);
app.use('/api/employees', EmployeeRoutes);
// The "catchall" handler: for any request that doesn't match one above, send back index.html.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
