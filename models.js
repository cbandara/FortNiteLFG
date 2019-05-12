const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ["pc", "xb1", "psn"]
  },
  region: {
    type: String,
    required: true,
    enum: ["NA-EAST", "NA-WEST", "EU"]
  }
});

const commentSchema = new mongoose.Schema({
  datePosted: { type: Date, default: Date.now },
  message: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const PostSchema = new mongoose.Schema({
  postName: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  platform: {
    type: String,
    required: true,
    enum: ["pc", "xb1", "psn"]
  },
  region: {
    type: String,
    required: true,
    enum: ["NA-EAST", "NA-WEST", "EU"]
  },
  datePosted: { type: Date, default: Date.now },
  deadline: { type: Date },
  message: { type: String, required: true },
  comments: [commentSchema]
});

UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username
  };
};

PostSchema.methods.serialize = function() {
  let post = {
    ...this._doc,
    id: this._id,
    username: this.username
  };
  delete post.__v;
  delete post._id;
  return post;
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model("User", UserSchema);
const Post = mongoose.model("Post", PostSchema);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = { User, Post, Comment };
