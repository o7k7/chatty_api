import Router from 'express';

import Message from '../model/message.js';

import { authenticate } from '../mw/authenticationMw.js';

export default ({ db }) => {
  const api = Router();

  // '/v1/messages/add' - Create
  api.post('/add', authenticate, (req, res) => {
    const newMessage = new Message();
    newMessage.messageBody = req.body.messageBody;
    newMessage.userId = req.body.userId;
    newMessage.channelId = req.body.channelId;
    newMessage.userName = req.body.userName;
    newMessage.userAvatar = req.body.userAvatar;
    newMessage.userAvatarColor = req.body.userAvatarColor;

    newMessage.save((err) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json({ message: 'Message saved successfully' });
    });
  });

  // '/v1/messages/:id' - Update
  api.put('/:id', authenticate, (req, res) => {
    Message.findById(req.params.id, (err, message) => {
      const modifiedMessage = message;
      if (err) {
        res.status(500).json({ message: err });
      }
      modifiedMessage.messageBody = req.body.messageBody;
      modifiedMessage.userId = req.body.userId;
      modifiedMessage.channelId = req.body.channelId;
      modifiedMessage.userName = req.body.userName;
      modifiedMessage.userAvatar = req.body.userAvatar;
      modifiedMessage.userAvatarColor = req.body.userAvatarColor;

      modifiedMessage.save((error) => {
        if (err) {
          res.status(500).json({ message: error });
        }
        res.status(200).json({ message: 'Message updated' });
      });
    });
  });

  // '/v1/messages/byChannel/:channelId'
  api.get('/byChannel/:channelId', authenticate, (req, res) => {
    Message
      .find({ 'channelId': req.params.channelId }, (err, messages) => {
        if (err) {
          res.status(500).json({ message: err });
        }
        res.status(200).json(messages);
      });
  });

  // '/vq/messages/:id' -Delete
  api.delete('/:id', authenticate, (req, res) => {
    Message.remove({
      _id: req.params.id,
    }, (err, message) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json({ message: 'Message Successfully Removed' });
    });
  });

  // '/v1/messages/' - Delete all
  api.delete('/', authenticate, (req, res) => {
    Message.find({}, (err, users) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json({ message: 'Users All Removed' });
    });
  });

  return api;
};
