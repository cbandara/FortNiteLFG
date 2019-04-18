// const uuid = require('uuid')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

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

const PostSchema = new mongoose.Schema({

})


UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', UserSchema);
module.exports = { User };