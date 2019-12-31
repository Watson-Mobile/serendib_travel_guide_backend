const express = require('express');
const router = express.Router();

// import user controller
const review_controller = require('../controllers/review.controller');

// post new review
router.post('/review',review_controller.addReview);

//get reviews by place
router.get('/review/:place_id',review_controller.getReviewsByPlace);

//get average ratings for a given place_id
router.get('/review/ratings/:place_id',review_controller.getRating);


module.exports = router;