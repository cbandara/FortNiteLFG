const express = require('express');
const app = express();
const User = require('./schema')

const morgan = require('morgan')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

app.use(express.static('public'));

const { DATABASE_URL, PORT} = require('./config')

app.get('/'), (req, res) => {
  res.status(100).json("message")
}

app.post('/login', (req, res) => {
  const loginInfo = User.create(
    req.body.username,
    req.body.password
  )
  res.status(201).json(loginInfo)
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