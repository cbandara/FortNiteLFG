"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const { User, Post } = require("../models");

const router = express.Router();

const jsonParser = bodyParser.json();

const jwtAuth = passport.authenticate("jwt", { session: false });

router.post("/", jsonParser, jwtAuth, (req, res) => {
  console.log(req.user);
  console.log(req.body);

  // Get request body
  // Validate postName is not empty
  // Get req.user.id for user ref
  // I do not know how to compare the dates which are in a string format
  // 2019-05-02T17:36:54
  // Dont have to check the platform and region because mongoose already does
  // Check the message because it could be empty string

  Post.create({
    postName: req.body.postName,
    user: req.user.id,
    platform: req.body.platform,
    region: "NA-WEST",
    deadline: new Date(req.body.deadline),
    message:
      "Looking 332rw for a person to play duos. Must have K/D ratio over 2.0"
  })
    .then(post => res.status(201).json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).send("Error while posting");
    });
});

router.get("/", (req, res) => {
  Post.find()
    .then(posts => res.status(200).json(posts.map(post => post.serialize())))
    .catch(err => {
      console.error(err);
      res.status(500).send("Error while getting posts");
    });
});

module.exports = { router };
