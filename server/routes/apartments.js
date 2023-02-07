let express = require('express');
let router = express.Router();
// const sequenceGenerator = require('./sequenceGenerator');
const Apartment = require('../models/apartment');
var axios = require('axios');
const {ObjectId} = require('mongodb');

router.get('/', (req, res, next) => {
  Apartment.find()
    .then(apartments => {
      console.log(apartments);
      res.status(200).json({
        apartments: apartments
      });
      // console.log(apartments);
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred HERE',
        error: error
      });
    })
});

router.get('/distance', (req, res, next) => {
  var config = {
    method: 'get',
    url: 'https://maps.googleapis.com/maps/api/distancematrix/json?destinations=4976%20Naniloa%20Drive%20Holladay%2C%20UT&origins=266%20W%203rd%20S%20Rexburg%2C%20ID&units=imperial&key=AIzaSyA-mJcglZSokFda-QAwIIzGX2T-cg2GR0A',
    headers: {}
  };

  axios(config)
    .then(function (response) {
      res.send(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
})

router.get('/details/:id', (req, res, next) => {
  let id = ObjectId(req.params.id);
  Apartment.findOne({"_id": id})
    .then(apartment => {
      console.log(apartment)
      res.status(200).json({
        message: 'Successfully found apartment!',
        apartment: apartment
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    })
});

router.post('/', (req, res, next) => {
  Apartment.findOne({
    "id": req.params.id
  })
  .then(apartment => {
    res.status(200).json({
      message: 'Successfully found assignment!',
      apartment: apartment
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'An error occurred',
      error: error
    });
  })

  // const maxApartmentId = sequenceGenerator.nextId("apartments");
  console.log(maxApartmentId);

  const apartment = new Apartment({
    id: maxAssignmentId,
    courseName: req.body.courseName,
    assignmentName: req.body.assignmentName,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    color: req.body.color,
    notes: req.body.notes
  });

  assignment.save()
    .then(createdAssignment => {
      res.status(201).json({
        message: 'Assignment added successfully',
        assignment: createdAssignment
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

router.put('/:id', (req, res, next) => {
  Assignment.findOne({
      id: req.params.id
    })
    .then(assignment => {
      assignment.courseName = req.body.courseName;
      assignment.assignmentName = req.body.assignmentName;
      assignment.dueDate = req.body.dueDate;
      assignment.priority = req.body.priority;
      assignment.color = req.body.color;
      assignment.notes = req.body.notes;

      Assignment.updateOne({
          id: req.params.id
        }, assignment)
        .then(result => {
          res.status(204).json({
            message: 'Assignment updated successfully'
          })
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Assignment not found.',
        error: {
          assignment: 'Assignment not found'
        }
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Assignment.findOne({
      id: req.params.id
    })
    .then(assignment => {
      Assignment.deleteOne({
          id: req.params.id
        })
        .then(result => {
          res.status(204).json({
            assignment: "Assignment deleted successfully"
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        })
    })
    .catch(error => {
      res.status(500).json({
        message: 'Assignment not found.',
        error: {
          assignment: 'Assignment not found'
        }
      });
    });
});

module.exports = router;
