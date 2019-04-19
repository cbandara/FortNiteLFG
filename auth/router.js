'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const jsonParser = bodyParser.json()

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  })
}

// router.post('/register', jsonParser, (req, res) => {
//   const requiredFields = ['username', 'password']
//   for (let i = 0; i < requiredFields.length; i++) {
//     const field = requiredFields[i]
//     if (!(field in req.body)) {
//       const message =  `Missing \`${field}\` in request body`
//       console.error(message)
//       return res.status(400).send(message)
//     }
//   }
  
//   let username = req.body.username;
//   let password = req.body.password;
//   let platform = req.body.platform;

//   axios.get(`https://api.fortnitetracker.com/v1/profile/${platform}/${username}`, {
//     headers: {
//       'TRN-Api-Key': process.env.FORTNITE_API_KEY
//     }
//   })
//     .then(response => {
//       console.log(response.data)
//       if (!response.data.epicUserHandle) {
//         return res.status(400).send("Could not find epic username")
//       }
//       else {return User.findOne({username})
//         .then(user => {
//           if (user) {
//             const message = `username is already taken`
//             console.error(message)
//             return res.status(400).send(message)
//           }
//           else {

//             // Create Token Here?
//             User.create({username, password})
//             .then(user => {
//               const userRes = {
//                 id: user._id,
//                 username: user.username
//               }
//               res.status(201).json(userRes)
//             })
//           }
//         })
//       }
//     })
//     .catch(err => {
//       console.error(err)
//       res.status(500).json({ error: 'something went horribly wrong'})
//     })

// })


const localAuth = passport.authenticate('local', {session: false})

router.post('/login', jsonParser, localAuth, (req, res) => {
  const authToken = createAuthToken(req.user)
  res.json({authToken})
  return res.redirect('/users/' + user.username)
})


const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = { router }
