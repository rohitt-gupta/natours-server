const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find()

    res.status(200).send({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (error) {
    res.status(400).send({
      status: 'Fail',
      message: error
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).send({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).send({
      status: 'fail',
      message: error
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: "Invalid Data Sent",
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }

};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).send({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).send({
      status: 'fail',
      message: error
    });
  }
};


// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   if (val > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'invalid id' });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   // console.log(req.body.name);
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(400)
//       .json({ status: 'fail', message: 'missing name or price' });
//   }
//   next();
// };

// const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);

  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: { tour: newTour },
  //     });
  //   }
  // );
