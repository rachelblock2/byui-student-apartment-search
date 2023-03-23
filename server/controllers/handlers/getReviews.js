require('dotenv').config();
const Apartment = require('../../models/apartment');
var axios = require('axios');

module.exports = () => {
    console.log('here');
  Apartment.find({}).then(async (apartments) => {
    console.log(apartments);
    for (apartment of apartments) {
      const ratingsResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(apartment.name.trim())}&inputtype=textquery&fields=rating&key=${process.env.API_KEY}`);
      // axios(configRatings)
      console.log(ratingsResponse.data);
      console.log(`Start ${apartments.length}`);
      //   .then(async function (response) {

      console.log(apartment.name);
      console.log(ratingsResponse.data.candidates[0].rating);
      apartment.rating = ratingsResponse.data.candidates[0].rating;
      Apartment.updateOne({_id: apartment._id}, apartment);

      // If the apartment rating is less than the query search request, take it out of the ratings

    //   if (await ratingsResponse.data.candidates[0].rating < req.query.rating) {
    //     console.log(ratingsResponse.data.candidates[0].rating);
    //     console.log(req.query.rating);
    //     console.log(apartment.name);
    //     let index = apartments.indexOf(apartment);
    //     apartments.splice(index, 1);
    //     console.log(`New length: ${apartments.length}`);
    //   }
    }
    // console.log(apartments.length);
  })
}
