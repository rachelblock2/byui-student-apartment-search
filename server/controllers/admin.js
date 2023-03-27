//ADMIN CONTROLLER
require('dotenv').config();
const path = require('path');
const ApartmentIdentifier = require('../models/apartment-identifier');
const Apartment = require('../models/apartment');
const jwt = require('jsonwebtoken');
var axios = require('axios');
const fs = require('fs');
const {
  ObjectId
} = require('mongodb');

// Gets and saves apartment with corresponding placeId
exports.addAptId = (req, res, next) => {
  if (!req.body.apartmentName) {
    res.status(400).send({
      message: 'Cannot provide empty content!'
    });
    return;
  }

  const apartmentName = req.body.apartmentName;

  // Find placeId from Google API based on apartment name
  var configTime = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=43.825386,-111.792824&radius=1500&keyword=${encodeURIComponent(apartmentName.trim())}&key=${process.env.API_KEY}`,
    headers: {}
  };

  axios(configTime)
    .then((response) => {
      let placeId = response.data.results[0].place_id;
      const apartmentIdentifier = new ApartmentIdentifier({
        _id: ObjectId(),
        apartmentName: apartmentName,
        placeId: placeId
      });
      apartmentIdentifier.save()
        .then(() => {
          res.status(201).json({
            message: "Apartment Identifier added successfully!",
            placeId: placeId
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
}

// Saves name, address, phone, url, images, and website of the apartment
exports.addAptDetails = (req, res, next) => {
  if (!req.body.placeId) {
    res.status(400).send({
      message: 'Cannot provide empty content!'
    });
    return;
  }

  let placeId = req.body.placeId;

  // Find details of apartment based on placeId
  var configTime = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/details/json?&place_id=${placeId}&key=${process.env.API_KEY}`,
    headers: {}
  };

  let apartmentPhotos = [];
  axios(configTime)
    .then(async (response) => {
      const newApartment = new Apartment({
        _id: ObjectId(),
        name: response.data.result.name,
        address: response.data.result.formatted_address,
        phone: response.data.result.formatted_phone_number,
        url: response.data.result.url,
        website: response.data.result.website,
        rating: response.data.result.rating,
        amenities: [],
        images: [],
        price: 0,
        aptGender: []
      })
      for (photo of response.data.result.photos) {
        try {
          const imgResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${process.env.API_KEY}`, {
            responseType: 'text',
            responseEncoding: 'base64'
          });
          fs.writeFileSync(`./src/assets/${photo.photo_reference}.jpeg`, imgResponse.data, { encoding: "base64" });

          apartmentPhotos.push(`/assets/${photo.photo_reference}.jpeg`);
        } catch (error) {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        };
      }

      newApartment.images = apartmentPhotos;

      newApartment.save()
        .then(() => {
          res.status(201).json({
            apartment: newApartment,
            message: "Apartment added successfully!"
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
}

// Saves amenities, prices, and gender of apartments
exports.addAdditionalDetails = (req, res, next) => {
  let id = ObjectId(req.params.id);
  Apartment.findOne({
    _id: id
  }).then(apartment => {
    apartment.amenities = req.body.amenities;
    apartment.price = req.body.price;
    apartment.aptGender = req.body.aptGender;
    Apartment.updateOne({_id: id}, apartment)
    .then(result => {
      res.status(204).json({
        message: 'Apartment updated successfully!',
        apartment: result
      })
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred.',
        error: error
      })
    })
  })
  .catch(error => {
    res.status(500).json({
      message: 'Assignment not found.',
      error: error
    });
  })
}