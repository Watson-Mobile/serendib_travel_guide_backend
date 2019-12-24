const express = require('express');
const router = express.Router();
const multer = require('multer');
var path = require('path');
const fs = require('fs');

// import user controller
const place_controller = require('../controllers/place.controller');

let rootDestinationPath = path.join(__dirname, '..', 'uploads', 'images');

var storage = multer.diskStorage(
    {
        destination:function ( req, file, cb ) {
            let desPath = path.join(rootDestinationPath,req.body.name);
            if (!fs.existsSync(desPath)){
                fs.mkdirSync(desPath);
            }
            cb( null, desPath);
        },
        filename: function ( req, file, cb ) {
            cb( null, req.body.name +"_"+file.originalname );
        }
    }
);
const upload = multer({storage:storage}).array('images',5);

// post new place
router.post('/place', (req, res) => {
    upload(req,res,function(err) {
        if(err) {
            return res.end({
                success:false,
                status:408,
                message:"Image upload failed.",
                error:err
            });
        }else{
            place_controller.addPlace(req,res);
        }
    });
       
});

module.exports = router;