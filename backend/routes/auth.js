const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// SECRET KEY (Ideally this goes in .env, but for now we keep it simple)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

// REGISTER API
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// LOGIN API
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate Token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

module.exports = router;