//APARTMENTS CONTROLLER
require('dotenv').config();
const path = require('path');
const Apartment = require('../models/apartment');
const ApartmentSuggestion = require('../models/apartment-suggestion');
const jwt = require('jsonwebtoken');
var axios = require('axios');
const {
  ObjectId
} = require('mongodb');

// Gets all apartments
exports.getApartments = async (req, res, next) => {
  Apartment.find()
    .then(apartments => {
      res.status(200).json({
        apartments: apartments
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred HERE',
        error: error
      });
    })
}

// Gets apartments that match query parameters from user's search
exports.getFilteredApartments = (req, res, next) => {
  // Check for price, amenities, gender, and rating match
  Apartment.find({
      $and: [{
          price: {
            $elemMatch: {
              $lte: req.query.price
            }
          }
        },
        {
          amenities: {
            $in: [
              req.query.amenities
            ]
          }
        },
        {
          aptGender: {
            $in: [
              req.query.aptGenderOptions
            ]
          }
        },
        {
          rating: {
            $gte: req.query.rating
          }
        }
      ]
    }).then(async (apartments) => {
      for (apartment of apartments) {
        // Check for time to walk between college and apartment
        const walkTime = await axios(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=525%20S%20Center%20St%2C%20Rexburg%2C%20ID%2083460&origins=${encodeURIComponent(apartment.address.trim())}&units=imperial&mode=walking&key=${process.env.API_KEY}`);

        if (walkTime.data.rows[0].elements[0].duration.text > req.query.walkTime) {
          let index = apartments.indexOf(apartment);
          apartments.splice(index, 1);
        }

        // Check for time to drive between college and apartment
        const driveTime = await axios(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=525%20S%20Center%20St%2C%20Rexburg%2C%20ID%2083460&origins=${encodeURIComponent(apartment.address.trim())}&units=imperial&mode=driving&key=${process.env.API_KEY}`);

        if (driveTime.data.rows[0].elements[0].duration.text > req.query.walkTime) {
          let index = apartments.indexOf(apartment);
          apartments.splice(index, 1);
        }
      }

      res.status(200).json({
          message: 'Apartments have been searched!',
          apartments: apartments
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        })
    })
    .catch(function (error) {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
}

// Gets driving time for specific apartment
exports.getDrivingTime = (req, res, next) => {
  let config = getTime(req.query.location, "driving");
  axios(config)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
}

// Gets walking time for specific apartment
exports.getWalkingTime = (req, res, next) => {
  let config = getTime(req.query.location, "walking");
  axios(config)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
}

// Gets time between apartment and college
function getTime(location, method) {
  var config = {
    method: 'get',
    url: 'https://maps.googleapis.com/maps/api/distancematrix/json?destinations=525%20S%20Center%20St%2C%20Rexburg%2C%20ID%2083460&origins=' + location + '&units=imperial&mode=' + method + '&key=' + process.env.API_KEY,
    headers: {}
  };
  return config;
}

// Gets an individual apartment with its details
exports.getApartment = (req, res, next) => {
  let id = ObjectId(req.params.id);
  Apartment.findOne({
      "_id": id
    })
    .then(apartment => {
      res.status(200).json({
        message: 'Successfully found apartment!',
        apartment: apartment
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    })
}

// Creates an apartment suggestion from user
exports.suggestApartment = (req, res, next) => {
  const aptName = req.body.aptName;
  const userId = ObjectId(req.body.id);
  // Check if suggested apartment already exists
  Apartment.findOne({
      name: aptName
    })
    .populate("favorites")
    .then((apartment) => {
      if (apartment !== null) {
        res.status(422).send({
          message: "Apartment already exists."
        });
      } else {
        const newAptSuggestion = new ApartmentSuggestion({
          _id: ObjectId(),
          aptName: aptName,
          userId: userId
        })

        newAptSuggestion.save()
          .then((result) => {
            res.status(201).send({
              message: "Apartment has been submitted for review!",
              aptName: aptName
            })
          })
          .catch((err) => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            err.message = 'Failed to process request';
            next(err);
          })
      }
    })
}
