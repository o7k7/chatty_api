const mongoose = require('mongoose');

const { Schema } = mongoose;

const channelSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: false,
    maxlength: 150,
  },
});

module.exports = mongoose.model('Channel', channelSchema);
