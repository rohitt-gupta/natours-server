const express = require('express');

const router = express.Router({ mergeParams: true });

const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTOurUserIds,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.deleteReview
  );

module.exports = router;
