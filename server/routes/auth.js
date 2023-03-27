require('dotenv').config()
const isAuth = require('../middleware/isAuth');
let express = require('express');
const { body } = require('express-validator');
let router = express.Router();
let jwt = require('jsonwebtoken');

const authController = require('../controllers/auth');

//Signs a user up for an account
router.post(
    '/signup',
   //  [
   //     body('email')
   //        .isEmail()
   //        .withMessage('Please enter a valid email.')
   //        .custom((value, { req }) => {
   //           return User.findOne({ email: value }).then((userDoc) => {
   //              if (userDoc) {
   //                 return Promise.reject('Email address exists already!');
   //              }
   //           });
   //        }),
   //     body('password').trim().isLength({ min: 7 }),
   //     body('fname').trim().not().isEmpty(),
   //     body('lname').trim().not().isEmpty(),
   //  ],
    authController.signup
 );

// Logs a user into their account
router.post('/login', 
[
  body('email')
  .isEmail()
  .withMessage('Please enter a valid email.'),
  body('password').trim().isLength({
    min: 7,
  })
], 
authController.login);

// Needs to resend token because the state is refreshed
router.get('/refreshToken', isAuth, authController.refreshToken);

// Verifies a user is logged in and logs user out
router.post('/logout', isAuth, authController.logout);

// Gets individual user information
router.get('/user-info/:id', isAuth, authController.getUser);

// Adds a favorite apartment to a user's favorites on their account
router.post('/addFavorite', isAuth, authController.addFavorite);

// Deletes a favorite apartment from a user's favorites on their account
router.post('/deleteFavorite', isAuth, authController.deleteFavorite);

module.exports = router;
