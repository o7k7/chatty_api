import mongoose from 'mongoose';

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
const Channel = mongoose.model('Channel', channelSchema);
export default Channel;
