const mongoose = require('mongoose');
const validator = require('validator');

// name email photo password, password confirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // thi method only works on .create or .save.
      // it will not work on the update method
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not same'
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
