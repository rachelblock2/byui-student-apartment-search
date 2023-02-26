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
        console.log(hashedPassword);
        if (hashedPassword === user.password) {

          console.log(user);
          // If the password passed in hashed matches user password hashed in database

          const accessToken = jwt.sign({
            user
          }, process.env.ACCESS_TOKEN_SECRET);
          // const refreshToken = jwt.sign({
          //   user
          // }, process.env.REFRESH_TOKEN_SECRET);
          // refreshTokens.push(refreshToken);
          // console.log(refreshTokens);
          res.status(201).send({
            message: "User Logged In",
            accessToken: accessToken,
            // refreshToken: refreshToken,
            user: user
          })
        } else {
          res.status(422).send({
            message: 'Invalid Credentials!'
          });
        }
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

exports.logout = (req, res, next) => {
  const authHeader = req.headers['authorization'].split(' ')[1];

  //STEP2
  jwt.sign(authHeader, '', {
    expiresIn: 1
  }, (logout, err) => {
    if (logout) {
      res.status(201).send({
        message: 'You have been Logged Out.',
      });
    } else {
      //STEP3
      res.status(400).send({
        message: 'Error!',
      });
    }
  });
}


exports.signup = async (req, res, next) => {
  /**
   * STEP1: check if body inputs are empty or not
   * STEP2: Validate input (if works with front end validation as well)
   * STEP3: Make variables out of all inputs individually
   * STEP4: Encrypt Password
   * STEP5: Plug input variable into variables of new User model
   * STEP6: Save new User model and all inputted variables
   * STEP7: Add new User to designated company,
   * STEP7a: If company doesn't exist, create new Company model
   * STEP8: Error Checking
   */
  console.log(''); //This allows all the documentation above to be compacted

  //STEP1
  if (!req.body.email || !req.body.password) {
    res.status(400).send({
      message: 'Cannot provide empty content!'
    });
    return;
  }

  //STEP2
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new Error('Validation failed.');
    error.data = errors.array();
    res.status(422).send({
      message: error.data
    });
    throw error;
  }

  //STEP3 
  //   let randomString = _.times(16, () => (Math.random()*0xF<<0).toString(24)).join('');
  //   console.log(randomString);
  //   const maxUserId = mongoose.Types.ObjectId(randomString);
  const email = req.body.email;
  const first_name = req.body.fname;
  const last_name = req.body.lname;
  const password = req.body.password;

  //STEP4

  // Creating a unique salt for a particular user
  let salt = crypto.randomBytes(16).toString('hex');

  // Hashing user's salt and password with 1000 iterations
  let hashedPassword = crypto.pbkdf2Sync(password, salt,
    1000, 64, `sha512`).toString(`hex`);


  //  _id: maxUserId,
  const user = new User({
    _id: ObjectId(),
    email: email,
    password: hashedPassword,
    fname: first_name,
    lname: last_name,
    salt: salt
  })
  console.log(user);
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

exports.getUser = (req, res, next) => {
  const userId = req.params.id;
  console.log(userId);
  // User.findOne({
  //   email: email,
  // })
  // .then((user) => {
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

exports.addFavorite = (req, res, next) => {
  const userId = req.body.id;
  const apartmentId = req.body.apartment._id;
  User.findOne({
    _id: userId
  })
  .populate("favorites")
  .then((user) => {
    console.log(user);
    if (user === null) {
      res.status(422).send({
        message: "User not found."
      });
    } else {
      Apartment.findOne({
        _id: apartmentId
      }).then((apartment) => {
        console.log(user);
        console.log(user.favorites);
        console.log(apartment);
        // let apartmentId = apartment._id;
        // console.log(JSON.parse(apartment));
        user.favorites.push(apartment);
        console.log(user.favorites);
        user.save();
        res.status(201).send({
          message: "Apartment added to favorites!",
          apartment: apartment
        })
      })
    }
  })
}

exports.deleteFavorite = (req, res, next) => {
  const userId = req.body.id;
  const apartmentId = req.body.apartment._id;
  User.findOne({
    _id: userId
  })
  .populate("favorites")
  .then((user) => {
    console.log(user);
    if (user === null) {
      res.status(422).send({
        message: "User not found."
      });
    } else {
      Apartment.findOne({
        _id: apartmentId
      }).then((apartment) => {
        console.log(user);
        console.log(user.favorites);
        console.log(apartment);
        // let apartmentId = apartment._id;
        // console.log(JSON.parse(apartment));
        let apartmentIndex = user.favorites.indexOf(apartment._id);
        console.log(apartmentIndex);
        user.favorites.splice(apartmentIndex, 1)
        console.log(user.favorites);
        user.save();
        res.status(201).send({
          message: "Apartment removed to favorites!",
          apartment: apartment
        })
      })
    }
  })
}
