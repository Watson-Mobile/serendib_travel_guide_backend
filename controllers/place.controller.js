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


module.exports = {addPlace,getPlaceByName};