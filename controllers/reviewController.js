// const Review = require('./reviewModel../models/reviewModel');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const Reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: Reviews.length,
    data: { Reviews }
  });
});
exports.setTOurUserIds = (req, res, next) => {
  //Allow nested Routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
