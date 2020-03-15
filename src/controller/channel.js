import Router from 'express';

import Channel from '../model/channel.js';
import User from '../model/user.js';

import { authenticate } from '../mw/authenticationMw.js';

export default ({ db }) => {
  const api = Router();

  // '/v1/channel/add' - Create
  api.post('/add', authenticate, (req, res) => {
    const newChannel = new Channel();
    newChannel.name = req.body.name;
    newChannel.description = req.body.description;

    newChannel.save((err) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json({ message: 'Channel saved successfully' });
    });
  });

  // '/v1/channels/' - Read
  api.get('/', authenticate, (req, res) => {
    Channel.find({}, (err, channels) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json(channels);
    });
  });

  // '/v1/channels/:id' - Read
  api.get('/:id', authenticate, (req, res) => {
    Channel.findById(req.params.id, (err, channel) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json(channel);
    });
  });

  // '/v1/channels/:id' - Delete
  api.delete('/:id', authenticate, (req, res) => {
    User.remove({
      _id: req.params.id,
    }, (err, channel) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json({ message: 'Channel Successfully Removed' });
    });
  });

  return api;
};
