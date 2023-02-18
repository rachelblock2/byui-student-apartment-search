//AUTH CONTROLLER
require('dotenv').config();
const path = require('path');
const {
  validationResult
} = require('express-validator');
const User = require('../models/user');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
   ObjectId
 } = require('mongodb');

exports.login = (req, res) => {
  // Authenicate User
  const username = req.body.username
  const user = {
    name: username
  }
  console.log(process.env.ACCESS_TOKEN_SECRET);

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m'
  })
  console.log(accessToken);
  res.json({
    accessToken: accessToken
  })
}

exports.signup = async (req, res, next) => {
  console.log(req.body);
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
    error.statusCode = 422;
    error.data = errors.array();
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

  //   return newUser.save((err) => {
  //     if (err) {
  //       return res.status(400).send({
  //         message: "Failed to add user."
  //       });
  //     } else {
  //       return res.status(201).send({
  //         message: "User added successfully."
  //       });
  //     }
  //   });

  //   crypto
  //     .createHash(password, 12)
  //     .then((hashedPw) => {
  //       //STEP5
  //       const user = new User({
  //         email: email,
  //         password: hashedPw,
  //         first_name: first_name,
  //         last_name: last_name,
  //         company: company,
  //       });
  //       return user.save(); //STEP6
  //     })
  //     .then((data) => {
  //       // TODO: Delete this, it's only for testing purposes
  //       Company.findOne({
  //           company_name: company
  //         }) //STEP7
  //         .then((comp) => {
  //           console.log(comp);
  //           let new_company;
  //           if (!comp) {
  //             //STEP7a
  //             new_company = new Company({
  //               company_name: company,
  //               logo: 'https://www.southcharlottefamilycounseling.com/wp-content/uploads/2015/10/cropped-logo-dummy.png',
  //               employees: [
  //                 data._id, // Potentially import mongoose id??
  //               ],
  //               tasks: [],
  //             });
  //           } else {
  //             //STEP7
  //             new_company = comp;
  //             user_array = new_company.employees;
  //             user_array.push(data._id);
  //             new_company.employees = user_array;
  //           }
  //           console.log(new_company);
  //           return new_company.save();
  //         })
  //         //STEP8
  //         .catch((err) => {
  //           res.status(500).send({
  //             message: err.message ||
  //               'An error occurred while creating the company!',
  //           });
  //         });
  //       res.status(201).send(data._id); // Change this to return something else???
  //     })
  //     .catch((err) => {
  //       //STEP8
  //       res.status(500).send({
  //         message: err.message || 'An error occurred while creating the user!',
  //       });
  //     });
};
