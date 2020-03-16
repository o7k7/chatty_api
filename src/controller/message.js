import Router from 'express';

import Message from '../model/message.js';

import { authenticate } from '../mw/authenticationMw.js';

export default ({ db }) => {
  const api = Router();

  // '/v1/messages/add' - Create
  api.post('/add', authenticate, (req, res) => {
    const newMessage = new Message();
    const {
      messageBody,
      userId,
      channelId,
      userName,
      userAvatar,
      userAvatarColor,
    } = req.body;
    newMessage.messageBody = messageBody;
    newMessage.userId = userId;
    newMessage.channelId = channelId;
    newMessage.userName = userName;
    newMessage.userAvatar = userAvatar;
    newMessage.userAvatarColor = userAvatarColor;

    newMessage.save((err) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json({ message: 'Message saved successfully' });
    });
  });

  // '/v1/messages/:id' - Update
  api.put('/:id', authenticate, (req, res) => {
    const {
      messageBody,
      userId,
      channelId,
      userName,
      userAvatar,
      userAvatarColor,
    } = req.body;
    const filter = { _id: req.params.id };
    const update = {
      messageBody,
      userId,
      channelId,
      userName,
      userAvatar,
      userAvatarColor,
    };

    Message.findOneAndUpdate(filter, update, {
      new: true,
    }, (error, updatedMessage) => {
      if (error) {
        res.status(500).json({ message: error });
      }
      res.status(200).json({ message: 'Message updated' });
    });
  });

  // '/v1/messages/channel/:channelId'
  api.get('/channel/:channelId', authenticate, (req, res) => {
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
