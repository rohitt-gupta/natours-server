const express = require('express');

const router = express.Router();
const userControllers = require('../controllers/userController');
const authController = require('./../controllers/authController');

router.post('/signup', authController.signup);
router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);
router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
