import express from 'express';
import passport from 'passport';

import { respond, authenticate, generateAccessToken } from '../mw/authenticationMw.js';

import Account from '../model/account.js'
import UserHelper from'./helpers/UserHelper.js';

export default ({ db }) => {
  const api = express.Router();

  // '/v1/accounts/register'
  api.post('/register', (req, res) => {
    UserHelper.findUserByEmail(req.body.email, (error, userData) => {
      if (error) {
        res.status(409).json({ message: `An error occured: ${error.message}` });
      } else if (userData) {
        res.status(300).json({ message: `Email ${req.body.email} is already registered` });
      } else {
        Account.register(new Account({ username: req.body.email }), req.body.password,
          (err, account) => {
            if (err) {
              res.status(500).json({ message: err });
            } else {
              passport.authenticate('local', { session: false })(req, res, () => {
                res.status(200).send('Successfully created new account');
              });
            }
          });
      }
    });
  });

  // '/v1/accounts/login'
  api.post('/login', (req, res, next) => {
    UserHelper.findUserByEmail(req.body.email, (err, userData) => {
      if (err) {
        res.status(409).json({ message: `An error occured: ${err.message}` });
      } else {
        next();
      }
    });
  }, passport.authenticate('local', { session: false, scope: [], failWithError: true }), (err, req, res, next) => {
    if (err) {
      res.status(401).json({ message: 'Email or password invalid, please check your credentials' });
    }
  }, generateAccessToken, respond);

  // '/v1/accounts/logout'
  api.get('/logout', authenticate, (req, res) => {
    req.logout();
    delete req.session;
    res.status(200).send();
  });

  api.get('/me', authenticate, (req, res) => {
    res.status(200).json(req.user);
  });

  return api;
};
