const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PWD);
mongoose.connect(
  db,
  {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err) => console.log('Connect to database successful')
);

app.listen(process.env.PORT, () => console.log('App is running on port 8000'));
