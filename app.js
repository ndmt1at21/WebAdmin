const express = require('express');
const morgan = require('morgan');
const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter');
const viewRouter = require('./routes/viewRouter');
const orderRouter = require('./routes/orderRouter');

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

// FOR VIEW
app.use('/', viewRouter);
app.use('/product', productRouter);
app.use('/user', userRouter);
app.use('/order', orderRouter);

module.exports = app;
