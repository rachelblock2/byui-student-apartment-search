//AUTH CONTROLLER
require('dotenv').config();
const path = require('path');
const {
  validationResult
} = require('express-validator');
const User = require('../models/user');
const Apartment = require('../models/apartment');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
  ObjectId
} = require('mongodb');

// let refreshTokens = [];

// Signs user up for account
exports.signup = async (req, res, next) => {
  // Error checking
  if (!req.body.email || !req.body.password) {
    res.status(400).send({
      message: 'Cannot provide empty content!'
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.data = errors.array();
    res.status(422).send({
      message: error.data
    });
    throw error;
  }

  // Create new user
  const email = req.body.email;
  const first_name = req.body.fname;
  const last_name = req.body.lname;
  const password = req.body.password;

  // Creating a unique salt for a particular user
  let salt = crypto.randomBytes(16).toString('hex');

  // Hashing user's salt and password with 1000 iterations
  let hashedPassword = crypto.pbkdf2Sync(password, salt,
    1000, 64, `sha512`).toString(`hex`);

  const user = new User({
    _id: ObjectId(),
    email: email,
    password: hashedPassword,
    fname: first_name,
    lname: last_name,
    salt: salt
  })

  user.save()
    .then(() => {
      res.status(201).json({
        message: "User added successfully"
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
};

// Logs the user into the website with validated credentials
exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.data = errors.array();
    res.status(422).send({
      message: error.data
    });
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
      email: email,
    })
    .then((user) => {
      if (user === null) {
        res.status(422).send({
          message: "User not found."
        });
      } else {
        // hash password before checking
        let hashedPassword = crypto.pbkdf2Sync(password,
          user.salt, 1000, 64, `sha512`).toString(`hex`);
        
          
        // If the password passed in hashed matches user password hashed in database
        if (hashedPassword === user.password) {
          // Create JWT
          const accessToken = jwt.sign({
            user
          }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
          
          const refreshToken = jwt.sign({
            user
          }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "15m" });
          
          // Removing sensitve data before returning user object repsonse
          let modUser = {
            _id: user._id,
            fname: user.fname,
            lname: user.lname,
            favorites: user.favorites,
            email: "",
            password: "",
            salt: ""
          }
          
          // Return JWT and user object
          res.status(201).send({
            message: "User Logged In",
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: modUser
          })
        } else {
          res.status(422).send({
            message: 'Invalid Credentials!'
          });
        }
      }
    })
}

// Should reaffirm user is logged in with JWT
exports.refreshToken = (req, res, next) => {
  console.log(req.user);
  const accessToken = jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET);
  res.status(201).send({
    message: "User Refreshed",
    accessToken: accessToken,
    // refreshToken: refreshToken,
    user: req.user.user
  })
}

// Gets user's account information
exports.getUser = (req, res, next) => {
  const userId = req.params.id;
  User.findOne({
      _id: userId
    })
    .populate('favorites')
    .then((user) => {
      if (user === null) {
        res.status(422).send({
          message: "User not found."
        });
      } else {
        res.status(201).send({
          message: "User Found",
          user: user
        })
      }
    })
}

// Logs the user out
exports.logout = (req, res, next) => {
  const authHeader = req.headers['authorization'].split(' ')[1];

  // Sets the JWT to immediately expire, therefore invalidating it and logging user out
  jwt.sign(authHeader, '', {
    expiresIn: 1
  }, (logout, err) => {
    if (logout) {
      res.status(201).send({
        message: 'You have been Logged Out.',
      });
    } else {
      res.status(400).send({
        message: 'Error!',
      });
    }
  });
}

// Adds an apartment with information to the user's favorites list
exports.addFavorite = (req, res, next) => {
  const userId = req.body.id;
  const apartmentId = req.body.apartment._id;
  User.findOne({
      _id: userId
    })
    .populate("favorites")
    .then((user) => {
      if (user === null) {
        res.status(422).send({
          message: "User not found."
        });
      } else {
        Apartment.findOne({
          _id: apartmentId
        }).then((apartment) => {
          // Adds apartment to user's favorites list
          user.favorites.push(apartment);
          user.save();
          res.status(201).send({
            message: "Apartment added to favorites!",
            apartment: apartment
          })
        })
      }
    })
}

// Removes an apartment with information to the user's favorites list
exports.deleteFavorite = (req, res, next) => {
  const userId = req.body.id;
  const apartmentId = req.body.apartment._id;
  User.findOne({
    _id: userId
  })
    .populate("favorites")
    .then((user) => {
      if (user === null) {
        res.status(422).send({
          message: "User not found."
        });
      } else {
        Apartment.findOne({
          _id: apartmentId
        }).then((apartment) => {
          let apartmentIndex = user.favorites.indexOf(apartment._id);
          // Deletes apartment from user's favorites list
          user.favorites.splice(apartmentIndex, 1);

          user.save();
          res.status(201).send({
            message: "Apartment removed from favorites!",
            apartment: apartment
          })
        })
      }
    })
}

// function generateAccessToken() {
//   const accessToken = jwt.sign({
//     user
//   }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
//   return accessToken;
// }

// exports.token = (req, res, next) => {
//   const refreshToken = req.body.token;
//   if (refreshToken === null) return res.sendStatus(401);
//   if (refreshTokens.includes(refreshToken)) return res.sendStatus(403);
//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
  //     if (err) return res.sendStatus(401)
//     const accessToken = generateAccessToken();
//     res.json({ accessToken: accessToken });
//   })
// }