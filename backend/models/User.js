const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  phone: {
    type: String,
    default: '',
  },
  birthDate: {
    type: String,
    default: '',
  }
});

module.exports = mongoose.model('User', UserSchema);
