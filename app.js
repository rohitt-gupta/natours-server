const fs = require('fs');
const express = require('express');
const { application } = require('express');
const { log } = require('console');

const app = express();
app.use(express.json()); // function that can modify the upcoming json data

app.use((req, res, next) => {
  log('hello from the middlewear');
  next();
});

app.use((req, res, next) => {
  req.responseTime = new Date().toISOString();

  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).send({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid id' });
  }

  const tour = tours.find((el) => el.id === id);

  res.status(200).send({
    status: 'success',
    data: { tour },
  });
};

const createTour = (req, res) => {
  //   console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid id' });
  }
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid id' });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

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
