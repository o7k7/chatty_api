const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  avatarName: {
    type: String,
    default: '',
  },
  avatarColor: { type: String, default: '' },
});

module.exports = mongoose.model('User', userSchema);
