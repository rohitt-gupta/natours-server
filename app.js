const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES

app.use(morgan('dev')); // logs the api request-response cycle details
app.use(express.json()); // function that can modify the upcoming json data

app.use((req, res, next) => {
  console.log('hello from the middlewear');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// 2) ROUTE HANDLERS

// 3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// 4) SERVER STARTED
module.exports = app;

// app.get('/', (req, res) => {
//     res.status(200).json({ message: 'Hello From the server Side!!', app: 'Natours' });
// })

// app.post('/', (req, res) => {
//     res.send('You can post in this endpoint...')
// })

// API routes

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);

// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
