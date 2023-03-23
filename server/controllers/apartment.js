//APARTMENTS CONTROLLER
require('dotenv').config();
const path = require('path');
const Apartment = require('../models/apartment');
const ApartmentSuggestion = require('../models/apartment-suggestion');
const jwt = require('jsonwebtoken');
const puppeteer = require('puppeteer');
var axios = require('axios');
const {
  ObjectId
} = require('mongodb');

exports.getApartments = async (req, res, next) => {
  // const testScraperValue = await sundanceScraper();
  // console.log(testScraperValue);
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
  console.log(req.query.rating);
  console.log(typeof req.query.rating);

  // check if user wants exact match with amenities or if every apartment with at least one

  // db.inventory.find({
  //   dim_cm: {
  //     $elemMatch: {
  //       $gt: 22,
  //       $lt: 30
  //     }
  //   }
  // })
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
        const walkTime = await axios(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=525%20S%20Center%20St%2C%20Rexburg%2C%20ID%2083460&origins=${encodeURIComponent(apartment.address.trim())}&units=imperial&mode=walking&key=${process.env.API_KEY}`);

        console.log(walkTime.data.rows[0].elements[0].duration.text);
        if (walkTime.data.rows[0].elements[0].duration.text > req.query.walkTime) {
          let index = apartments.indexOf(apartment);
          apartments.splice(index, 1);
          console.log(`Each time walk ${apartments.length}`);
        }

        const driveTime = await axios(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=525%20S%20Center%20St%2C%20Rexburg%2C%20ID%2083460&origins=${encodeURIComponent(apartment.address.trim())}&units=imperial&mode=driving&key=${process.env.API_KEY}`);

        console.log(driveTime.data.rows[0].elements[0].duration.text);
        if (driveTime.data.rows[0].elements[0].duration.text > req.query.walkTime) {
          let index = apartments.indexOf(apartment);
          apartments.splice(index, 1);
          console.log(`Each time drive ${apartments.length}`);
        }
      }

      // apartments.forEach(apartment => {
      //   console.log(encodeURIComponent(apartment.address.trim()));
      //   var config = {
      //     method: 'get',
      //     url: 'https://maps.googleapis.com/maps/api/distancematrix/json?destinations=525%20S%20Center%20St%2C%20Rexburg%2C%20ID%2083460&origins=' + encodeURIComponent(apartment.address.trim()) + '&units=imperial&mode=driving&key=' + process.env.API_KEY,
      //     headers: {}
      //   };

      //   axios(config)
      //     .then(function (response) {
      //       // console.log(response.data.rows[0].elements[0].duration.text.split(' ')[0]);
      //       if (response.data.rows[0].elements[0].duration.text > req.query.driveTime) {
      //         let index = apartments.indexOf(apartment);
      //         apartments.splice(index, 1);
      //       }
      //     })
      // })
      // console.log(`This is apartments checked for driving: ${apartments}`);

      // https://maps.googleapis.com/maps/api/place/details/json?fields=rating&place_id=ChIJFeJISgQLVFMRNvPAL9M65Iw&key=AIzaSyDzs5gbeZEVBQNpTMMfxIdxoGamfA8PCFI
      // for (apartment of apartments) {
      // var configRatings = {
      //   method: 'get',
      //   url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(apartment.name.trim())}&inputtype=textquery&fields=rating&key=${process.env.API_KEY}`,
      //   headers: {}
      // };        
      // }


      console.log(`These are the final apartments: ${apartments.length}`)
      res.status(200).json({
          message: 'Successfully found apartments!',
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

exports.getRatings = (req, res, next) => {
  var configRatings = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(apartment.name.trim())}&inputtype=textquery&fields=rating&key=${process.env.API_KEY}`,
    headers: {}
  };

  axios(configRatings)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
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

exports.suggestApartment = (req, res, next) => {
  const aptName = req.body.aptName;
  const userId = ObjectId(req.body.id);
  console.log(aptName, userId);
  Apartment.findOne({
      name: aptName
    })
    .populate("favorites")
    .then((apartment) => {
      console.log(apartment);
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

        console.log(newAptSuggestion);
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
