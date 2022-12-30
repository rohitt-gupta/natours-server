const express = require('express');
const morgan = require('morgan');
const router = require('./routes/tourRoutes');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// logs the api request-response cycle details
app.use(express.json()); // function that can modify the upcoming json data
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('hello from the middlewear');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
