let express = require('express');
let router = express.Router();
const isAuth = require('../middleware/isAuth');
const adminController = require('../controllers/admin');

// Gets the placeId from Google for the apartment and stores both the placeId and apartment name
router.post('/addAptId', adminController.addAptId);

// Saves the name, address, phone, url, images, and website to the apartment identified by placeId 
router.post('/addAptDetails', adminController.addAptDetails);

// Sends and saves the amenities, prices, and apartment gender options of the apartment identified by id
router.put('/addAdditionalDetails/:id', adminController.addAdditionalDetails);

module.exports = router;