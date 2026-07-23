const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Entry = require('../models/Entry');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

// Middleware to authenticate token
function auth(req, res, next) {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const bearer = token.split(' ')[1];
    const decoded = jwt.verify(bearer, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

// GET /api/entries -> Get all entries for a user
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/entries -> Create a new entry
router.post('/', auth, async (req, res) => {
  try {
    const { category, date, text, location, participants } = req.body;

    const newEntry = new Entry({
      user: req.user.id,
      category,
      date,
      text,
      location,
      participants
    });

    const entry = await newEntry.save();
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/entries/:id -> Update an entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { text, category, location, participants } = req.body;

    let entry = await Entry.findById(req.params.id);

    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    if (entry.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    if (text !== undefined) entry.text = text;
    if (category !== undefined) entry.category = category;
    if (location !== undefined) entry.location = location;
    if (participants !== undefined) entry.participants = participants;

    await entry.save();
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Entry not found' });
    res.status(500).send('Server Error');
  }
});

// DELETE /api/entries/:id -> Delete an entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    if (entry.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await Entry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Entry removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Entry not found' });
    res.status(500).send('Server Error');
  }
});

module.exports = router;
