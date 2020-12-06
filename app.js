const express = require('express');
const morgan = require('morgan');
const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter');
const orderRouter = require('./routes/orderRouter');

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

app.use('/product', productRouter);
app.use('/users', userRouter);
app.use('/order', orderRouter);

module.exports = app;
