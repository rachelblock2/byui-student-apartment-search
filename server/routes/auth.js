require('dotenv').config()
const isAuth = require('../middleware/isAuth');
let express = require('express');
const { body } = require('express-validator');
let router = express.Router();
let jwt = require('jsonwebtoken');

const authController = require('../controllers/auth');

//Sign up for an account
router.post(
    '/signup',
    [
       body('email')
          .isEmail()
          .withMessage('Please enter a valid email.')
          .custom((value, { req }) => {
             return User.findOne({ email: value }).then((userDoc) => {
                if (userDoc) {
                   return Promise.reject('Email address exists already!');
                }
             });
          }),
       body('password').trim().isLength({ min: 7 }),
       body('fname').trim().not().isEmpty(),
       body('lname').trim().not().isEmpty(),
    ],
    authController.signup
 );

// Log into account
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

router.post('/logout', isAuth, authController.logout);

router.get('/user-info/:id', isAuth, authController.getUser);

module.exports = router;
