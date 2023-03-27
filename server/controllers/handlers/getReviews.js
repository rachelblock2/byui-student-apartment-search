require('dotenv').config();
const Apartment = require('../../models/apartment');
var axios = require('axios');

// Loops through all apartments in the database and updates their rating from the Google API
module.exports = () => {
  Apartment.find({}).then(async (apartments) => {
    for (apartment of apartments) {
      const ratingsResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(apartment.name.trim())}&inputtype=textquery&fields=rating&key=${process.env.API_KEY}`);
      apartment.rating = ratingsResponse.data.candidates[0].rating;
      Apartment.updateOne({_id: apartment._id}, apartment);
    }
  })
}
