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

router.post('/suggestApartment', isAuth, apartmentController.suggestApartment);

// router.post('/', (req, res, next) => {
//   Apartment.findOne({
//       "id": req.params.id
//     })
//     .then(apartment => {
//       res.status(200).json({
//         message: 'Successfully found assignment!',
//         apartment: apartment
//       });
//     })
//     .catch(error => {
//       res.status(500).json({
//         message: 'An error occurred',
//         error: error
//       });
//     })

  // const maxApartmentId = sequenceGenerator.nextId("apartments");
  // console.log(maxApartmentId);

  // const apartment = new Apartment({
  //   id: maxAssignmentId,
  //   courseName: req.body.courseName,
  //   assignmentName: req.body.assignmentName,
  //   dueDate: req.body.dueDate,
  //   priority: req.body.priority,
  //   color: req.body.color,
  //   notes: req.body.notes
  // });

  // assignment.save()
  //   .then(createdAssignment => {
  //     res.status(201).json({
  //       message: 'Assignment added successfully',
  //       assignment: createdAssignment
  //     });
  //   })
  //   .catch(error => {
  //     res.status(500).json({
  //       message: 'An error occurred',
  //       error: error
  //     });
  //   });
// });


// Todo: these needs to be changed and protected so only admin can access
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
