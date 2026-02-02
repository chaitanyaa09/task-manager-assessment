require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth'); // <--- NEW: Imports the login logic

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to understand JSON data

// Use Routes
app.use('/api/tasks', taskRoutes); // Existing Task routes
app.use('/api/auth', authRoutes);  // <--- NEW: Adds Login/Register routes

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Connection Error:', err));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));