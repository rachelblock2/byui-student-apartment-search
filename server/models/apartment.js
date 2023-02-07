const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');

const apartmentSchema = mongoose.Schema({
   _id: { type: ObjectId, required: true },
   name: { type: String, required: true },
   address: { type: String, required: true },
   phone: { type: String, required: true },
   url: { type: String, required: true },
   amenities: { type: [String], required: true },
   images: { type: [String], required: true },
   price: { type: Number, required: true }
});

module.exports = mongoose.model('Apartment', apartmentSchema);