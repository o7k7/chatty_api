import dotenv from 'dotenv';

import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import socket from 'socket.io';
import passportLocal from 'passport-local';
import routes from './routes/index.js';

import Message from './model/message.js';
import Channel from './model/channel.js';
import Account from './model/account.js';


dotenv.config();

const LocalStrategy = passportLocal.Strategy;

const app = express();
app.server = http.createServer(app);
const io = socket(app.server);

app.use(bodyParser.json({
  limit: process.env.REQUEST_BODY_LIMIT,
}));

// passport config
app.use(passport.initialize());
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// api routes v1
app.use('/v1', routes);

// Base URL test endpoint to see if API is running
app.get('/v1', (req, res) => {
  res.json({ message: 'Up & Ready' });
});

/* ||||||||||||||||SOCKET||||||||||||||||||||||| */
// Listen for connection
const typingUsers = {};

io.on('connection', (client) => {
  console.log('a user connected');
  // Listens for a new chat message
  client.on('newChannel', (name, description) => {
    // Create channel
    const newChannel = new Channel({
      name,
      description,
    });
    // Save it to database
    newChannel.save((err, channel) => {
      // Send message to those connected in the room
      console.log('new channel created');
      io.emit('channelCreated', channel.name, channel.description, channel.id);
    });
  });

  // Listens for user typing.
  client.on('startType', (userName, channelId) => {
    console.log(`User ${userName} is writing a message...`);
    typingUsers[userName] = channelId;
    io.emit('userTypingUpdate', typingUsers, channelId);
  });

  client.on('stopType', (userName) => {
    console.log(`User ${userName} has stopped writing a message...`);
    delete typingUsers[userName];
    io.emit('userTypingUpdate', typingUsers);
  });

  // Listens for a new chat message
  client.on('newMessage', (messageBody, userId, channelId, userName, userAvatar, userAvatarColor) => {
    // Create message

    console.log(messageBody);

    const newMessage = new Message({
      messageBody,
      userId,
      channelId,
      userName,
      userAvatar,
      userAvatarColor,
    });
    // Save it to database
    newMessage.save((err, msg) => {
      // Send message to those connected in the room
      console.log('new message sent');

      io.emit('messageCreated', msg.messageBody, msg.userId, msg.channelId, msg.userName, msg.userAvatar, msg.userAvatarColor, msg.id, msg.timeStamp);
    });
  });
});
/* ||||||||||||||||||||END SOCKETS|||||||||||||||||| */

app.server.listen(process.env.PORT);
console.log(`Started on port ${app.server.address().port}`);

export default {
  app,
  io,
};
