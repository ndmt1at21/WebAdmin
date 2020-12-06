"use strict";

var express = require('express');

var morgan = require('morgan');

var app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express["static"]("".concat(__dirname, "/public")));
app.set('view engine', 'pug');
app.set('views', "".concat(__dirname, "/views"));
module.exports = app;