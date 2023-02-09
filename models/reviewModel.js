const mongoose = require('mongoose');
// const { findByIdAndDelete } = require('./tourModel');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: { type: Date, default: Date.now },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a author']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  // .populate({ path: 'tour', select: '-guides _id name ' });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // await Tour.findByIdAndUpdate(tourId, {
  //   ratingsQuantity: stats[0].nRating,
  //   ratingsAverage: stats[0].avgRating
  // });
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function() {
  // this points to current review
  // since we dont have Review document variable right now, we have to use this.constructor
  // Review.calcAverageRatings(this.tour);
  this.constructor.calcAverageRatings(this.tour);
});

/**
 * Adding the below 2 instance methods because
when we create any review the above function will 
update the ratingsAverage and ratingsQuantity,
but when we update any review rating or delete the review it will not 
update the ratingsAverage and ratingsQuantity. 
SO we implemented the below functions(2). 
*/

//findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function(next) {
  // await this.findOne(); does NOT work here, the wuery has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
  // console.log(await this.r.constructor.calcAverageRatings(this.r.tour));
});

const Review = mongoose.model('Review', reviewSchema);
// console.log(review);

module.exports = Review;
