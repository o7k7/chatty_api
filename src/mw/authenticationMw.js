const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const TOKENTIME = 60 * 60 * 24 * 30; // 1 month

const SECRET = 'OK7 GK7 LDS';

const authenticate = expressJwt({ secret: SECRET });

const generateAccessToken = (req, res, next) => {
  const { id } = req.user;
  req.token = req.token || {};
  req.token = jwt.sign({
    id,
  },
  SECRET, {
    expiresIn: TOKENTIME,
  });
  next();
};

const respond = (req, res) => {
  res.status(200).json({
    user: req.user.username,
    token: req.token,
  });
};

module.exports = {
  authenticate,
  generateAccessToken,
  respond,
};
