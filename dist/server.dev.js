"use strict";

var app = require('./app');

var mongoose = require('mongoose');

var dotenv = require('dotenv');

dotenv.config({
  path: './config.env'
});
var db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PWD);
mongoose.connect(db, {
  useCreateIndex: true,
  useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err) {
  return console.log('Connect to database successful');
});
app.listen(process.env.PORT, function () {
  return console.log('App is running on port 8000');
});