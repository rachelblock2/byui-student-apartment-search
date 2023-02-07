const mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
   maxAssignmentId: { type: Number, required: true }
});

module.exports = mongoose.model('Sequence', sequenceSchema);