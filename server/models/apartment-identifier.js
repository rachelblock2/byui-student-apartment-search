const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');

const apartmentIdentifierSchema = mongoose.Schema({
   _id: { type: ObjectId, required: true },
   apartmentName: { type: String, required: true },
   placeId: { type: String, required: true }
});

module.exports = mongoose.model('ApartmentIdentifier', apartmentIdentifierSchema);