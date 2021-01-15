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

// const corsOptions = {
//   origin: ['http://127.0.0.1:8002', 'http://ttshopvn.herokuapp.com'],
//   methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
//   allowedHeaders: ['X-Requested-With', 'content-type', 'Authorization'],
//   exposedHeaders: ['X-Paging-Current', 'X-Paging-Count'],
//   credentials: true
// };

// app.use(cors(corsOptions));

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

// FOR VIEW
app.use('/', viewRouter);
app.use('/product', productRouter);
app.use('/user', userRouter);
app.use('/order', orderRouter);

module.exports = app;
