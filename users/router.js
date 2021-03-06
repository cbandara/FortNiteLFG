"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const { User } = require("../models");
const { FORTNITE_API_KEY } = require("../config");

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new user
router.post("/", jsonParser, (req, res) => {
  const requiredFields = ["username", "password", "platform"];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Missing field",
      location: missingField
    });
  }

  const stringFields = ["username", "password", "platform"];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== "string"
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Incorrect field type: expected string",
      location: nonStringField
    });
  }

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ["username", "password", "platform"];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Cannot start or end with whitespace",
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      "min" in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      "max" in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let { username, password, platform } = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this

  axios
    .get(`https://api.fortnitetracker.com/v1/profile/${platform}/${username}`, {
      headers: {
        "TRN-Api-Key": FORTNITE_API_KEY
      }
    })
    .then(response => {
      if (!response.data.epicUserHandle) {
        return res.status(400).send("Could not find epic username");
      } else {
        return User.find({ username })
          .count()
          .then(count => {
            if (count > 0) {
              // There is an existing user with the same username
              return Promise.reject({
                code: 422,
                reason: "ValidationError",
                message: "Username already taken",
                location: "username"
              });
            }
            // If there is no existing user, hash the password
            return User.hashPassword(password);
          })
          .then(hash => {
            return User.create({
              username,
              password: hash,
              platform
            });
          })
          .then(user => {
            return res.status(201).json(user.serialize());
          })
          .catch(err => {
            // Forward validation errors on to the client, otherwise give a 500
            // error because something unexpected has happened
            console.log("err is ", err);
            if (err.reason === "ValidationError") {
              return res.status(err.code).json(err);
            }
            // res.status(500).json({ code: 500, message: "Internal server error" });
          });
      }
    });
});

module.exports = { router };
