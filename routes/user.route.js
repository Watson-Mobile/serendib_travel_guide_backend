const express = require('express');
const router = express.Router();

// import user controller
const user_controller = require('../controllers/user.controller');

// get all users
router.get('/user', user_controller.getAllUsers);

router.post('/user',user_controller.addUser);

router.post('/user/login',user_controller.getUser);

module.exports = router;
