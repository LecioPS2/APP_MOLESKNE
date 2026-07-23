const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Database connection
// HARDCODED TEMPORARILY: We added your URI directly here
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin_ubs:825425Bill12@saudeubs.dhpdnra.mongodb.net/APP_MOLESKINE?retryWrites=true&w=majority&appName=SaudeUBS';

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('MongoDB URI not provided. Skipping database connection for UI preview.');
}

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const entriesRoutes = require('./routes/entries');
app.use('/api/entries', entriesRoutes);

const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);

const path = require('path');

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to serve the React index.html for any non-API routes
app.use((req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Failed to send file:', filePath, err);
      res.status(500).send('Frontend not found at ' + filePath);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
