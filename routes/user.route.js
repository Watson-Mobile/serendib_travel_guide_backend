const express = require('express');
const router = express.Router();
const multer = require('multer');
var path = require('path');

var desPath = path.join(__dirname, '..', 'uploads', 'images');

var storage = multer.diskStorage(
    {
        destination: desPath,
        filename: function ( req, file, cb ) {
            cb( null, Date.now() +"_"+file.originalname );
        }
    }
);
const upload = multer({storage:storage})

// import user controller
const user_controller = require('../controllers/user.controller');



// create user get url
router.get('/user', user_controller.user);
router.post('/upload',upload.single('photo'), (req, res) => {
    if(req.file) {
        res.json(req.file);
    }
    else throw 'error';
});

module.exports = router;
