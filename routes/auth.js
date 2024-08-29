import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, dob, phone, address } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

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

export default router;
