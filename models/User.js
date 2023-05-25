const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'PLease enter your username'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your Email'],
    trim: true,
    unique: [true, 'Email must be unique'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 5,
  },
});

module.exports = mongoose.model('user', UserSchema);
