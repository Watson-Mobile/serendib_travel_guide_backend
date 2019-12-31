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
                fs.mkdir(desPath,{recursive: true}, err => {});
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
            return res.json({
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

router.get('/place/:name',place_controller.getPlaceByName);

router.get('/image',place_controller.getImage);

router.get('/place',place_controller.getPlacesByGPSLocation);

router.get('/all_place',place_controller.getAllPlaces);

module.exports = router;