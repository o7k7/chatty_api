require('dotenv').config();
const express = require('express');
const mongoDB = require('./dbmongo');

const app = express();

mongoDB.connectDB(db => {

});

app.get('/test', (req, res) => {
  res.send('{ "endpoint":"test" }');
});

app.get('/divert', (req, res) => {
  res.send('{ "endpoint":"divert" }');
});

app.listen(3000);
