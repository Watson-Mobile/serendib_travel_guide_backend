const express = require('express');
const router = express.Router();

// import user controller
const user_controller = require('../controllers/user.controller');


// create user get url
router.get('/user', user_controller.user);
module.exports = router;
