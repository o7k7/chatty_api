const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const { Schema } = mongoose;

const Account = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    maxlength: 10,
    minlength: 4,
  },
});


Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', Account);
