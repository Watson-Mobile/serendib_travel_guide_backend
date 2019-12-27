const Place = require('../models/place.model');

let addPlace = (req,res) => {
    
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
    });

    place.save((err, place) => {
        if (err) {
            res.json({
                success:false,
                status: 400,
                message:"Failed to save place",
                error: err
            });
            return;
        } 

        res.json({
            success: true,
            status: 200,
            message: 'Place added',
            data:place
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
                    error: err
                });
                return;
            }else{
                if(!place){
                    res.json({
                        success:false,
                        status: 404,
                        message:"Place not found",
                    });
                }else{
                    res.json({
                        success:true,
                        status: 200,
                        message:"Place found",
                        data:place
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
              error:err
          });
        } else {
          console.log('Sent:', fileName)
        }
      });
}

let getPlacesByGPSLocation = (req,res) =>{
    let longitude = Number(req.query.longitude);
    let latitude = Number(req.query.latitude);

    console.log()

    Place.find({
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
                error: err
            });
            return;
        }else{
            if(!places){
                res.json({
                    success:false,
                    status: 404,
                    message:"Places not found",
                });
            }else{
                res.json({
                    success:true,
                    status: 200,
                    message:places.length+" places found near given location.",
                    data:places
                });
            }
        }
    });
}


module.exports = {addPlace,getPlaceByName,getImage,getPlacesByGPSLocation};