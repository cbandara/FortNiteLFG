"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const { User, Post } = require("../models");

const router = express.Router();

const jsonParser = bodyParser.json();

const jwtAuth = passport.authenticate("jwt", { session: false });

router.post("/", jsonParser, jwtAuth, (req, res) => {
  // Validate postName is not empty
  // Get req.user.id for user ref
  // Dont have to check the platform and region because mongoose already does
  // Check the message because it could be empty string

  // const requiredFields = ["postName", "user", "platform", "region", "deadline"];

  Post.create({
    postName: req.body.postName,
    user: req.user.id,
    platform: req.body.platform,
    region: req.body.region,
    deadline: new Date(req.body.deadline),
    message: req.body.message
  })
    .then(post => res.status(201).json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).send("Error while posting");
    });
});

router.get("/my-posts", jwtAuth, (req, res) => {
  const id = req.user.id;
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

router.delete("/my-posts/:id", jwtAuth, (req, res) => {
  Post.remove(req.params.id);
  console.log(`Deleted Post: ${req.params.id}`);
  res.status(204).end();
});

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

module.exports = { router };
