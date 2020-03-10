const mongoose = require('mongoose')
const User = require('./user')
const Channel = require('./channel')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new Schema({
  messageBody: {
    type: String,
    required: true
  },
  timeStamp: {
    type: Date,
    default: Date.now
  },
  userId: {
    required: true,
    type: ObjectId,
    ref: 'User'
  },
  channelId: {
    type: ObjectId,
    ref: 'Channel'
  },
  userName: String, default: "",
  userAvatar: String, default: "",
  userAvatarColor: String, default: ""
});


module.exports = mongoose.model('Message', messageSchema);
