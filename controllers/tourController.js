const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).send({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (error) {
    res.status(400).send({
      status: 'Fail',
      message: error,
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
      message: error,
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
      message: 'Invalid Data Sent',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
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
      message: error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        // group method requires id field which is by 
        // which you want to group the results
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRating: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({
      status: 'success',
      stats,
    });
  } catch (error) {
    res.status(400).send({
      status: 'fail',
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; // year is provided by api by the user
    const plan = await Tour.aggregate([
      {
        // startDates have 3 values each tour data.
        // to divide one tour into all the copies wrt date is done using unwind
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }

    ]);
    res.status(200).json({
      status: 'success',
      plan,
    });
  } catch (error) {
    res.status(400).send({
      status: 'fail',
      message: error,
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

//BUILD QUERY
// 1. Basic filtering remove page,sort limit and fields from the req.query or params
// const { page, sort, limit, fields, ...queryObj } = req.query;

// console.log(queryObj);

// 2. Advance filtering
// as in mongo db advancefiltering options are selected as $gte
// { duration: { gte: '5' }, difficulty: 'easy' } //query parameter received from params
// { duration: { '$gte': '5' }, difficulty: 'easy' }  MONGODB implementation
/**
 * following is the example of api request.
 * http://localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=1500
 * gte - greater than equalto
 * gt - greaer than
 * lte - less than equal
 * lt - less than
 */
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

// // console.log(JSON.parse(queryStr));
// let query = Tour.find(JSON.parse(queryStr));

// SORTING
/**
 * use sort = price for ascending order.
 * use sort = -price for descending order
 * http://localhost:3000/api/v1/tours?sort=-price
 *
 * WHen the field has same price use the next field for the order,i.e,
 * http://localhost:3000/api/v1/tours?sort=price,maxGroupSize
 * we use , to give the second parameter next tpo the first one
 * in mongoose it is done using space
 * sort('price' 'maxGroupSize')
 *
 * so we split the query.params.sort from all the comas(,) and join then by space.
 *
 */

// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
// } else {
//   // if no sort functionality is povided it will give with the order of date created latest first.
//   query = query.sort('-createdAt');
// }

// FIELD LIMITING
/**
 * Filed limiting is a method by which you can only get the data which is required
 * or specified.
 * or you can set whchi feilds are not required by using "-" in front of the field params.
 */
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query = query.select(fields);
// } else {
//   query = query.select('-__v');
// }

// PAGINATION
// const pages = req.query.page * 1 || 1;
// const limits = req.query.limit * 1 || 100;
// const skip = (pages - 1) * limits;

// query = query.skip(skip).limit(limits);
// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) throw new Error('This page does not exist')
// }

// console.log("tours query", query);
// EXECUTE QUERY
