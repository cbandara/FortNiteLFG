const express = require('express');
const app = express();
// const passport = require('passport')
const morgan = require('morgan')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;

const User = require('./schema')

const jsonParser = bodyParser.json();

app.use(express.static('public'));
app.use(bodyParser)

const {DATABASE_URL, PORT} = require('./config')



app.get('/'), (req, res) => {
  res.status(100).json("message")
}

app.post('/register', jsonParser), (req, res) => {
  console.log("made it to endpoint")
  const requiredFields = ['username', 'password']
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]
    if (!(field in req.body)) {
      const message =  `Missing \`${field}\` in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }
  let username = req.body.username;
  let password = req.body.password;
  User.findOne(username)
  .then(user => {
    if (user) {
      const message = `username is already taken`
      console.error(message)
      return res.status(400).send(message)
    }
    else {
      User.create({username, password})
      .then(user => res.status(201).json(user)
      console.log("made it to else")
      )
    }
  })
  .catch(err => {
    console.error(err)
    res.status(500).json({ error: 'something went horribly wrong'})
  })
}

app.get('/login', (req, res) => {
  User.findById(req.body.username)
})

// $.ajax({
//   url: "http://localhost:8080/login",
//   type: 'GET',
//   // Fetch the stored token from localStorage and set in the header
//   headers: {"Authorization": localStorage.getItem('token')}
// });

// $.ajax({
//   url: "http://localhoust:8080/register",
//   type: 'GET'
// })


let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err)
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`)
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect()
        reject(err)
      })
    })
  })
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server')
      server.close(err =>
         {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  })
}


if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err))
}

module.exports = {app, runServer, closeServer}