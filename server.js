const express = require('express');
const app = express();
// const passport = require('passport')
const morgan = require('morgan')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();

app.use(express.static('public'));
app.use(bodyParser)

const {DATABASE_URL, PORT} = require('./config')
const User = require('./schema')


app.get('/'), (req, res) => {
  res.status(100).json("message")
}

app.post('/register', jsonParser), (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  const loginInfo = User.create(username, password);
  res.status(201).json(loginInfo);
  console.log(username, password)
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