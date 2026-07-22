const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['Rascunho', 'Visita Técnica', 'Anotação', 'Reunião'],
    required: true,
  },
  date: {
    type: String, // Storing as string to keep it simple, e.g., '2026-07-22 14:00'
    required: true,
  },
  text: {
    type: String,
    required: false, // For notes/drafts
  },
  location: {
    type: String,
    required: false, // For meetings
  },
  participants: {
    type: String,
    required: false, // For meetings
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Entry', EntrySchema);
