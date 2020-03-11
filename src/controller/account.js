import { Router } from 'express';
import { generateAccessToken, respond, authenticate } from '../mw/authenticationMw';

const passport = require('passport');
const Account = require('../model/account');
const UserDataExt = require('./extensions/userData-ext');


export default ({ config, db }) => {
  const api = Router();

  // '/v1/accounts/register'
  api.post('/register', (req, res) => {
    UserDataExt.findUserByEmail(req.body.email, (error, userData) => {
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
    UserDataExt.findUserByEmail(req.body.email, (err, userData) => {
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
