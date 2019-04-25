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

const commentSchema = new mongoose.Schema({
  datePosted: {type: Date, default: Date.now},
  message: {type: String, required: true},
  username: {type: String, ref: 'User', required: true}
})

const PostSchema = new mongoose.Schema({
  postName: {type: String, required: true},
  author: {type: String, ref: 'User', required: true},
  platform: {type: String, required: true},
  region: {type: String, required: true},
  deadline: {type: Date, default: Date.now},
  message: {type: String, required: true},
  comments: [commentSchema]
})

UserSchema.methods.serialize = function() {
  return {
    username: this.username || ''
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password)
}

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10)
}

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Comment = mongoose.model('Comment', commentSchema)
module.exports = {User, Post, Comment};