import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new Schema({
  messageBody: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  userId: {
    required: true,
    type: ObjectId,
    ref: 'User',
  },
  channelId: {
    type: ObjectId,
    ref: 'Channel',
  },
  userName: { type: String, default: '' },
  userAvatar: { type: String, default: '' },
  userAvatarColor: { type: String, default: '' },
});

export default mongoose.model('Message', messageSchema);
