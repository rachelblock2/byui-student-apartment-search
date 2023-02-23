const mongoose = require('mongoose');
const {
  ObjectId
} = require('mongodb');

const userSchema = mongoose.Schema({
  _id: {
    type: ObjectId,
    required: true
  },
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
