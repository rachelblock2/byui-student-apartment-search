let express = require('express');
let router = express.Router();
const isAuth = require('../middleware/isAuth');
const apartmentController = require('../controllers/apartment');

// Gets all the apartments
router.get('/', apartmentController.getApartments);

// Gets the apartments that match the filters in the user's search
router.get('/filtered/', apartmentController.getFilteredApartments);

// Gets the walking time between the college and apartment complex
router.get('/distance/walking/', apartmentController.getWalkingTime);

// Gets the driving time between the college and apartment complex
router.get('/distance/driving/', apartmentController.getDrivingTime)

// Gets an individual apartment's details
router.get('/details/:id', apartmentController.getApartment);

// Adds an apartment suggestion to the apartment suggestion database
router.post('/suggestApartment', isAuth, apartmentController.suggestApartment);

module.exports = router;
