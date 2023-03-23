const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');

const suggestionSchema = mongoose.Schema({
   _id: { type: ObjectId, required: true },
   aptName: { type: String, required: true },
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('ApartmentSuggestion', suggestionSchema);