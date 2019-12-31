const Review = require('../models/review.model');
const mongoose = require('mongoose');

let addReview = (req,res) => {
    let review = new Review({
        comment:req.body.comment,
        rating:req.body.rating,
        place:req.body.place_id,
        user_posted:req.body.user_id
    });

    review.save((err, review) => {
        if (err) {
            res.json({
                success:false,
                status: 400,
                message:"Failed to save review",
                error: err,
                data:null
            });
            return;
        } 

        res.json({
            success: true,
            status: 200,
            message: 'Review added',
            data:review,
            error:null

        });
    });

}

let getReviewsByPlace = (req,res) => {
    Review.find({
        place:req.params.place_id
    }).exec((err,reviews)=> {
        if(err){
            res.json({
                success:false,
                status: 400,
                message:"Error in getting reviews of given place with id"+req.body.place_id,
                data:null,
                error: err
            });
            return;

        }else{

            if(!reviews){
                res.json({
                    success:true,
                    status: 404,
                    message:"Reviews are not available",
                    data:null,
                    error:"Not found"
                });

            }else{

                res.json({
                    success:true,
                    status: 200,
                    message:reviews.length+" reviews are found on given place",
                    data:reviews,
                    error:null
                });
            }
        }
    });
}

let getRating = (req,res) => {
    Review.aggregate()
    .match({
        place:mongoose.Types.ObjectId(req.params.place_id)
    })
    .group({
        _id: null, average_ratings: { $avg: "$rating" }
    }).exec((err,ratings)=>{
       
        if(err){
            res.json({
                success:false,
                status: 400,
                message:"Error in fetching average reviews",
                data:null,
                error: err
            });
            return;
        }else{
            console.log(ratings);
            res.json({
                success:true,
                status: 200,
                message:"Average rating is successfully calculated",
                data:ratings,
                error:null
            });
        }
    });

}

module.exports ={addReview,getReviewsByPlace,getRating};