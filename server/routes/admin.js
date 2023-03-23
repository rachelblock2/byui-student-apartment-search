let express = require('express');
let router = express.Router();
const isAuth = require('../middleware/isAuth');
const adminController = require('../controllers/admin');

router.post('/addAptId', adminController.addAptId);

router.post('/addAptDetails', adminController.addAptDetails);

router.put('/addAdditionalDetails/:id', adminController.addAdditionalDetails);

module.exports = router;