let Sequence = require('../models/sequence');

let maxAssignmentId;
let sequenceId = null;

function SequenceGenerator() {

  Sequence.findOne()
    .exec(function(err, sequence) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }

      sequenceId = sequence._id;
      maxAssignmentId = sequence.maxAssignmentId;
    });
}

SequenceGenerator.prototype.nextId = function(collectionType) {

  let updateObject = {};
  let nextId;

  switch (collectionType) {
    case 'assignments':
    maxAssignmentId++;
    updateObject = {maxAssignmentId: maxAssignmentId};
    nextId = maxAssignmentId;
      break;
    default:
      return -1;
  }

  Sequence.updateOne({_id: sequenceId}, {$set: updateObject},
    function(err) {
      if (err) {
        console.log("nextId error = " + err);
        return null
      }
    });

  return nextId;
}

module.exports = new SequenceGenerator();