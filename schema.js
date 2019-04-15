// const uuid = require('uuid')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  platform: {
    type: Array,
    required:true,
  }
});


const User = mongoose.model('User', UserSchema);
module.exports = User;