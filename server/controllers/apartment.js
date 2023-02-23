//APARTMENTS CONTROLLER
require('dotenv').config();
const path = require('path');
const Apartment = require('../models/apartment');
const jwt = require('jsonwebtoken');
var axios = require('axios');
const {
  ObjectId
} = require('mongodb');

exports.getApartments = (req, res, next) => {
  Apartment.find()
    .then(apartments => {
      console.log(apartments);
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

exports.getFilteredApartments = (req, res, next) => {
  Apartment.find({
      $and: [{
          price: {
            $lte: req.query.price
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
        }
      ]
    }).then(apartments => {
      console.log(apartments);
      apartments.forEach(apartment => {
        console.log(encodeURIComponent(apartment.address.trim()));
        var config = {
          method: 'get',
          url: 'https://maps.googleapis.com/maps/api/distancematrix/json?destinations=525%20S%20Center%20St%2C%20Rexburg%2C%20ID%2083460&origins=' + encodeURIComponent(apartment.address.trim()) + '&units=imperial&mode=walking&key=' + process.env.API_KEY,
          headers: {}
        };

        axios(config)
          .then(function (response) {
            console.log(response.data.rows[0].elements[0].duration.text.split(' ')[0]);
            if (response.data.rows[0].elements[0].duration.text > req.query.walkTime) {
              let index = apartments.indexOf(apartment);
              apartments.splice(index, 1);
            }
          })
      })

      apartments.forEach(apartment => {
        console.log(encodeURIComponent(apartment.address.trim()));
        var config = {
          method: 'get',
          url: 'https://maps.googleapis.com/maps/api/distancematrix/json?destinations=525%20S%20Center%20St%2C%20Rexburg%2C%20ID%2083460&origins=' + encodeURIComponent(apartment.address.trim()) + '&units=imperial&mode=driving&key=' + process.env.API_KEY,
          headers: {}
        };

        axios(config)
          .then(function (response) {
            console.log(response.data.rows[0].elements[0].duration.text.split(' ')[0]);
            if (response.data.rows[0].elements[0].duration.text > req.query.driveTime) {
              let index = apartments.indexOf(apartment);
              apartments.splice(index, 1);
            }
          })
      })
      console.log(apartments)
      res.status(200).json({
        message: 'Successfully found apartments!',
        apartments: apartments
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

exports.getDrivingTime = (req, res, next) => {
  let config = getTime(req.query.location, "driving");
  axios(config)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

exports.getWalkingTime = (req, res, next) => {
  let config = getTime(req.query.location, "walking");
  axios(config)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getTime(location, method) {
  var config = {
    method: 'get',
    url: 'https://maps.googleapis.com/maps/api/distancematrix/json?destinations=525%20S%20Center%20St%2C%20Rexburg%2C%20ID%2083460&origins=' + location + '&units=imperial&mode=' + method + '&key=' + process.env.API_KEY,
    headers: {}
  };
  return config;
}

exports.getApartment = (req, res, next) => {
  let id = ObjectId(req.params.id);
  Apartment.findOne({
      "_id": id
    })
    .then(apartment => {
      console.log(apartment)
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
