const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// const router = require('./routes/tourRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour'
});
app.use('/api', limiter);

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

// app.get('/api/v1/gps/savedCommands', (req, res) => {
//   try {
//     // const data = {
//     //   0: { id: 0, name: 'new...' },
//     //   1: { id: 0, name: 'status' }
//     // };
//     // console.log('hello');
//     const data = [
//       { id: 0, name: 'new...' },
//       { id: 0, name: 'status' }
//     ];
//     res.status(200).send(
//       // status: 'success',
//       data
//     );
//   } catch (error) {
//     res.status(400).send({
//       status: 'fail',
//       message: error
//     });
//   }
// });
// app.get('/api/v1/gps/commandType', (req, res) => {
//   res.status(200).send('Hello From the server Side!!');
// });
// // app.use('', )

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Cant't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
