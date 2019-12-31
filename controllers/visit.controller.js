const Visit = require('../models/visit.model');

let addVisit = (req,res) =>{
    let visit = new Visit({
        place:req.body.place,
        user:req.body.user
    });

    visit.save((err,visit)=>{
        if(err){
            res.json({
                success:false,
                status: 400,
                message:"Failed to save visit",
                data:null,
                error: err
            });
            return;
        }

        res.json({
            success: true,
            status: 200,
            message: 'visit added',
            data:visit,
            error:null
        });
    });

}

let getVisitsByUserID = (req,res) => {
    let user_id = req.params.user_id;

    Visit.find({
        user:user_id
    }).exec((err,visits)=>{
        if(err){
            res.json({
                success:false,
                status: 400,
                message:"Failed to get user visited places",
                data:null,
                error: err
            });

            return;
        }else{
            if(!visits){
                res.json({
                    success:true,
                    status: 404,
                    message:"No visits are recorded for this user",
                    data:null,
                    error: "Not found"
                });
            }else{
                res.json({
                    success:true,
                    status: 200,
                    message:"User have visited ("+visits.length+") places.",
                    data:visits,
                    error: null
                });
            }
        }
    });
}


let getUsersByVisitedPlace = (req,res) => {
    let place_id = req.params.place_id;

    Visit.find({
        place:place_id
    }).distinct("user")
    .exec((err,users)=> {
        if(err){
            res.json({
                success:false,
                status: 400,
                message:"Failed to fetch users who visited the given places",
                data:null,
                error: err
            });

            return;
        }

        if(!users){
            res.json({
                success:true,
                status: 404,
                message:"Nobody visited the given place",
                data:null,
                error: "Not found"
            });
        }else{
            res.json({
                success:true,
                status: 200,
                message:users.length+" users have visited the given place",
                data:users,
                error: null
            });
        }
    });

}


module.exports = {addVisit,getVisitsByUserID,getUsersByVisitedPlace};

