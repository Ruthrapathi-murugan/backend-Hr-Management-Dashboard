import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // Ensure you have the correct path and file extension

const router = express.Router();

// Registration Endpoint
router.post('/api/register', async (req, res) => {
  const { name, email, password, dob, phone, address } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please fill in all fields' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword, dob, phone, address });
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
