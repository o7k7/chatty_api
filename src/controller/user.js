import { Router } from 'express';
import User from '../model/user';

import { authenticate } from '../mw/authenticationMw';

export default ({ config, db }) => {
  const api = Router();

  // '/v1/users/add' - Create
  api.post('/add', authenticate, (req, res) => {
    const newUser = new User();
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.avatarName = req.body.avatarName;
    newUser.avatarColor = req.body.avatarColor;

    newUser.save((err) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json(newUser);
    });
  });

  // '/v1/users/' - Read
  api.get('/', authenticate, (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json(users);
    });
  });

  // '/v1/users/:id' - Read 1
  api.get('/:id', authenticate, (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json(user);
    });
  });

  // '/v1/users/:id' - Update
  api.put('/:id', authenticate, (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      const modifiedUser = user;
      const {
        name,
        email,
        avatarName,
        avatarColor,
      } = req.body;
      modifiedUser.name = name;
      modifiedUser.email = email;
      modifiedUser.avatarName = avatarName;
      modifiedUser.avatarColor = avatarColor;
      modifiedUser.save((error) => {
        if (error) {
          res.status(500).json({ message: error });
        }
        res.status(200).json({ message: 'User info updated' });
      });
    });
  });

  // 'v1/users/byEmail/:email'
  api.get('/byEmail/:email', authenticate, (req, res) => {
    User
      .findOne({ 'email': req.params.email })
      .exec((err, userData) => {
        if (err) {
          res.status(500).json({ message: err });
        }
        res.status(200).json(userData);
      });
  });

  // '/vq/users/:id' -Delete
  api.delete('/:id', authenticate, (req, res) => {
    User.remove({
      _id: req.params.id,
    }, (err, user) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json({ message: 'User Successfully Removed' });
    });
  });

  // '/v1/users/' - Delete all
  api.delete('/', authenticate, (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json({ message: 'Users All Removed' });
    });
  });

  return api;
};
