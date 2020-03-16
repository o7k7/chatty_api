import dotenv from 'dotenv';

import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import socket from 'socket.io';
import passportLocal from 'passport-local';
import routes from './routes/index.js';

import Account from './model/account.js';
import SocketConnection from './socket/SocketConnection.js'

dotenv.config();

const LocalStrategy = passportLocal.Strategy;

const app = express();
app.server = http.createServer(app);
const io = socket(app.server);

app.use(bodyParser.json({
  limit: process.env.REQUEST_BODY_LIMIT,
}));

// Passport Configuration
app.use(passport.initialize());
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// API Versioning
app.use('/v1', routes);

// Base URL test endpoint to see if API is running
app.get('/v1', (req, res) => {
  res.json({ message: 'Up & Ready' });
});

// To test socket connection
// app.get('/', (req, res) => {
//   res.sendFile('/Users/orhunkupeli/dev/chat_api/src/index.html');
// });

SocketConnection.init(io);

app.server.listen(process.env.PORT);
console.log(`Started on port ${app.server.address().port}`);

export default {
  app,
  io,
};
