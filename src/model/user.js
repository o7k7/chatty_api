import mongoose from 'mongoose';

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
const User = mongoose.model('User', userSchema);

export default User;
