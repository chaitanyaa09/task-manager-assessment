const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const verifyToken = require('../middleware/authMiddleware'); // <--- Import the Guard

// GET all tasks (Optional: You can protect this too if you want)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new task (PROTECTED: Users must be logged in to add tasks)
router.post('/', verifyToken, async (req, res) => {  // <--- Added verifyToken here
  const task = new Task(req.body);
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update task (PROTECTED)
router.put('/:id', verifyToken, async (req, res) => { // <--- Added verifyToken here
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE task (PROTECTED)
router.delete('/:id', verifyToken, async (req, res) => { // <--- Added verifyToken here
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;