require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const {DATABASE_URL, PORT} = require('./config')
const {authRouter, localStrategy } = require('./auth/strategies')
const app = express();

mongoose.Promise = global.Promise;

app.use(express.static('public'));
//app.use(morgan('common'))

// CORS????

passport.use(localStrategy);

app.use('/api/auth/', authRouter)

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

app.get('/api', (req, res) => {
  res.status(100).json("message")
})

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