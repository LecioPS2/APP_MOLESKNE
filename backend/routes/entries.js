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

module.exports = router;
