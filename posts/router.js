"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const { User, Post } = require("../models");

const router = express.Router();

const jsonParser = bodyParser.json();

const jwtAuth = passport.authenticate("jwt", { session: false });

router.post("/", jsonParser, jwtAuth, (req, res) => {
  if (!req.body.postName) {
    return res.status(400).send("Post name is required");
  }
  if (!req.body.message) {
    return res.status(400).send("Post message is required");
  } else {
    Post.create({
      postName: req.body.postName,
      user: req.user.id,
      platform: req.body.platform,
      region: req.body.region,
      deadline: new Date(req.body.deadline),
      message: req.body.message,
      id: req.body.id
    })
      .then(post => res.status(201).json(post.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).send("Error while posting");
      });
  }
  // Validate postName is not empty
  // Get req.user.id for user ref
  // Dont have to check the platform and region because mongoose already does
  // Check the message because it could be empty string

  // const requiredFields = ["postName", "user", "platform", "region", "deadline"];
});

// Get Posts of Logged in User
router.get("/my-posts", jwtAuth, (req, res) => {
  Post.find({ user: req.user.id })
    .populate("user")
    .then(posts => {
      res.status(200).json(posts.map(post => post.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error while getting posts");
    });
});

// Delete a Post
router.delete("/my-posts/:id", jwtAuth, (req, res) => {
  Post.findOneAndDelete({ _id: req.params.id })
    .then(res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).send("Error while deleting");
    });
  console.log(`Deleted Post: ${req.params.id}`);
});

// Get All Posts
router.get("/", (req, res) => {
  Post.find({})
    .populate("user")
    .then(posts => {
      res.status(200).json(posts.map(post => post.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error while getting posts");
    });
});

// Get one post by ID
router.get("/:id", (req, res) => {
  Post.findById({ _id: req.params.id }).then(post => {
    res.status(200).json(post.serialize());
  });
});

module.exports = { router };
