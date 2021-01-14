const express = require('express');
const morgan = require('morgan');
const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter');
const viewRouter = require('./routes/viewRouter');
const orderRouter = require('./routes/orderRouter');
const cors = require('cors');

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.options('*', cors()); // include before other routes

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8002');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

// FOR VIEW
app.use('/', viewRouter);
app.use('/product', productRouter);
app.use('/user', userRouter);
app.use('/order', orderRouter);

module.exports = app;
