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
            console.log(desPath);
            if (!fs.existsSync(desPath)){
                console.log("destination path is not exists and have to create");
                fs.mkdir(desPath,{recursive: true}, err => {});
            }
            cb( null, desPath);
        },
        filename: function ( req, file, cb ) {
            cb( null, rNumbereq.body.name +"_"+file.originalname );
        }
    }
);

var storage2 = multer.diskStorage(
    {
        destination:function ( req, file, cb ) {
            let desPath = path.join(rootDestinationPath,req.params.name);
            if (!fs.existsSync(desPath)){
                fs.mkdir(desPath,{recursive: true}, err => {});
            }
            cb( null, desPath);
        },
        filename: function ( req, file, cb ) {
            cb( null, req.params.name +"_"+file.originalname );
        }
    }
);

const upload = multer({storage:storage}).array('images',5);

const upload2 = multer({storage:storage2}).array('images',5);

// post new place
router.post('/place', (req, res) => {
    try {
        console.log(req.body+" place posed..........................");
        console.log("place name:"+req.body.name);
        console.log("place type"+req.body.location_array);
        upload(req,res,function(err) {
            if(err) {
                console.log("Error"+err)
                return res.json({
                    success:false,
                    status:408,
                    message:"Image upload failed.",
                    error:err
                });
            }else{
                place_controller.addPlace(req,res);
                console.log("place added")
            }
        });
    } catch (error) {
        console.log(error);
    }    
});

router.post('/place/images/:name', (req, res) => {
    console.log(req);

    upload2(req,res,function(err) {
        if(err) {
            return res.json({
                success:false,
                status:408,
                message:"Image upload failed.",
                error:err
            });
        }else{
            let images = req.files;
            let image_path_array =[];
           
            for(let i=0 ;i<images.length ;i++){
                image_path_array.push(images[i].path);
            }

            res.json({
                success:false,
                status: 400,
                message:"Images uploaded",
                data:image_path_array,
                error: null
            });
        }
    });
       
});

router.post('/place/add',place_controller.addPlaceWithImagePaths);

router.get('/place/:name',place_controller.getPlaceByName);

router.get('/image',place_controller.getImage);

router.get('/place',place_controller.getPlacesByGPSLocation);

router.get('/all_place',place_controller.getAllPlaces);

router.get('/search_place',place_controller.searchPlaces);

router.get('/all_place_locations',place_controller.getGPSLocationsOfAllPlaces);

router.put('/place/verify/:id',place_controller.verifyPlace);

router.get('/not_verified_place',place_controller.getNotVerifiedPlacesForLocalGuide);

module.exports = router;