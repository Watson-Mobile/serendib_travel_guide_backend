const Place = require('../models/place.model');

let addPlace = (req,res) => {
    console.log("call to add place controller method");
    let images = req.files;
    let image_path_array =[];
    let location_array = [];
    req.body.location.forEach(element => {
        location_array.push(Number(element));
    });
    for(let i=0 ;i<images.length ;i++){
        image_path_array.push(images[i].path);
    }

    let place = new Place({
        name: req.body.name,
        location:{
            type: "Point",
            coordinates: location_array
        },
        description:req.body.description,
        type:req.body.type_array,
        image:image_path_array,
        user_posted:req.body.user_object_id,
        other_names:req.body.other_names
    });

    place.save((err, place) => {
        if (err) {
            res.json({
                success:false,
                status: 400,
                message:"Failed to save place",
                data:null,
                error: err
            });
            return;
        } 

        res.json({
            success: true,
            status: 200,
            message: 'Place added',
            data:place,
            error:null
        });
    })
}

let addPlaceWithImagePaths = (req,res) => {
    let location_array = [];

    req.body.location.forEach(element => {
        location_array.push(Number(element));
    });

    let place = new Place({
        name: req.body.name,
        location:{
            type: "Point",
            coordinates: location_array
        },
        description:req.body.description,
        type:req.body.type_array,
        image:req.body.images,
        user_posted:req.body.user_object_id,
        other_names:req.body.other_names
    });

    place.save((err, place) => {
        if (err) {
            res.json({
                success:false,
                status: 400,
                message:"Failed to save place",
                data:null,
                error: err
            });
            return;
        } 

        res.json({
            success: true,
            status: 200,
            message: 'Place added',
            data:place,
            error:null
        });
    })
}



let getPlaceByName = (req,res) => {
    let place_name = req.params.name;
    console.log(place_name);

    Place.findOne(
        {
            name:place_name
        }).exec((err,place) =>{
            if(err){
                res.json({
                    success:false,
                    status: 400,
                    message:"Failed get place," + place_name,
                    data:null,
                    error: err
                });
                return;
            }else{
                if(!place){
                    res.json({
                        success:false,
                        status: 404,
                        message:"Place not found",
                        data:null,
                        error:"Not found"
                    });
                }else{
                    res.json({
                        success:true,
                        status: 200,
                        message:"Place found",
                        data:place,
                        error:null
                    });
                }
            }
        });

}


let getImage = (req,res) => {
    let image = req.query.image_path;

    res.sendFile(image, null, function (err) {
        if (err) {
          res.json({
              success:false,
              status:400,
              message:"Failed to send file",
              data:null,
              error:err
          });
        } else {
          console.log('Sent:', image)
        }
      });
}

let getPlacesByGPSLocation = (req,res) =>{
    let longitude = Number(req.query.longitude);
    let latitude = Number(req.query.latitude);

    Place.find({
        verified: true,
        location:
       { $near :
          {
            $geometry: { type: "Point",  coordinates: [ longitude, latitude ] },
            $minDistance: 0,
            $maxDistance: 10000 //within 10km
          }
       }
    }).exec((err,places)=> {
        if(err){
            res.json({
                success:false,
                status: 400,
                message:"Error in getting places by GPS location",
                data:null,
                error: err
            });
            return;
        }else{
            if(!places){
                res.json({
                    success:false,
                    status: 404,
                    message:"Places not found",
                    data:null,
                    error:"Not found"
                });
            }else{
                res.json({
                    success:true,
                    status: 200,
                    message:places.length+" places found near given location.",
                    data:places,
                    error:null
                });
            }
        }
    });
}


let getAllPlaces = (req,res) =>{
    Place.find({verified:true}).exec((err,places)=>{
        if(err){
            res.json({
                success:false,
                status: 400,
                message:"Error in fetching all places",
                data:null,
                error: err
            });
            return;
        }
        else{
            if(!places){
                res.json({
                    success:false,
                    status: 404,
                    message:"Places not found",
                    data:null,
                    error:"Not found"
                });
            }else{
                res.json({
                    success:true,
                    status: 200,
                    message:"All places recorded in the system is fetched"+"("+places.length+")",
                    data:places,
                    error:null
                });
            }
        }
    });

}

let searchPlaces = (req,res) => {
    let searchQuery = req.query.query;

    Place.find(
        {$text: {$search: searchQuery}},
    )
    .exec(function(err, results) {
        if(err){
            console.log(err);
            res.json({
                success:false,
                status: 400,
                message:"Error in searching places",
                data:null,
                error: err
            });
            return;
        }
        else{
            res.json({
                success:true,
                status: 200,
                message:"All places recorded in the system is fetched"+"("+results.length+")",
                data:results,
                error:null
            }); 
        }
    });
}

let getGPSLocationsOfAllPlaces = (req,res) => {
    Place.find({})
    .select("location")
    .exec((err,gpsPoints)=>{
        if(err){
            res.json({
                success:false,
                status: 400,
                message:"Error in fetching gps coordinates of all places recorded in the system",
                data:null,
                error: err
            });
            return;
        }
        else{
            res.json({
                success:true,
                status: 200,
                message:"GPS coordinates of all places recorded in the system is fetched"+"("+gpsPoints.length+")",
                data:gpsPoints,
                error:null
            });
        }
    });

}

let getNotVerifiedPlacesForLocalGuide = (req,res) => {
    let longitude = req.query.longitude;
    let latitude = req.query.latitude;

    Place.find({
        location:
       { $near :
          {
            $geometry: { type: "Point",  coordinates: [ longitude, latitude ] },
            $minDistance: 0,
            $maxDistance: 10000 //within 10km
          }
       },
       verified:false
    }).exec((err,notVerifiedPlaces)=> {
        if(err){
            res.json({
                success:false,
                status: 400,
                message:"Error in getting not verified places near given gps location",
                data:null,
                error: err
            });
            return;
        }else{
            res.json({
                success:true,
                status: 200,
                message:notVerifiedPlaces.length + " places found near given location.",
                data:notVerifiedPlaces,
                error:null
            });
           
        }
    });
}

let verifyPlace = (req,res) => {
    let _id = req.params.id;
    Place.findByIdAndUpdate(_id,
        {verified:true},
        {
            new:true,
            upsert:false
        }).exec((err,place)=>{
            if(err){
                console.log(err);
                res.json({
                    success:false,
                    status: 400,
                    message:"Error in updating as verified",
                    data:null,
                    error: err
                });
                return;
            }
            else{
                res.json({
                    success:true,
                    status: 200,
                    message:"place is verified",
                    data:place,
                    error:null
                }); 
            }
        })
}

module.exports = {addPlace,getPlaceByName,getImage,getPlacesByGPSLocation,getAllPlaces,searchPlaces,
                    getGPSLocationsOfAllPlaces,getNotVerifiedPlacesForLocalGuide,verifyPlace,addPlaceWithImagePaths};