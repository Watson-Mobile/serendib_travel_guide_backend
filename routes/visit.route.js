const express = require('express');
const router = express.Router();

// import user controller
const visit_controller = require('../controllers/visit.controller');

// post new visit
router.post('/visit', visit_controller.addVisit);

//get visits of given user
router.get('/visit/:user_id',visit_controller.getVisitsByUserID);

//get all users who visited a given place
router.get('/visit/byplace/:place_id',visit_controller.getUsersByVisitedPlace);


module.exports = router;