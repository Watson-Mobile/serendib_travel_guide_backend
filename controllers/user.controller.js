const User = require('../models/user.model');

let addUser = (req,res) => {
    let longitude;
    let latitude;
    let guide_location = [];
    let user;
    console.log("add user controller method called");
    if(req.body.userType=='Local_Assistent'){
        longitude = Number(req.body.guide_location[0]);
        latitude = Number(req.body.guide_location[1]);
        guide_location.push(longitude);
        guide_location.push(latitude);

        user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username:req.body.username,
            email:req.body.email,
            userType:req.body.userType,
            telephone_number:req.body.telephone_number,
            password:req.body.password,
            nic_num:req.body.nic_num,
            guide_location: {
                type: "Point",
                coordinates: guide_location
            }
        });
    
    }
    else{
        user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username:req.body.username,
            email:req.body.email,
            userType:req.body.userType,
            telephone_number:req.body.telephone_number,
            password:req.body.password
    
        });
    }

    guide_location.push(longitude);
    guide_location.push(latitude);
   
    user.save((err, user) => {
        if (err) {
            res.json({
                success:false,
                status: 400,
                message:"Failed to save user",
                error: err,
                data:null
            });
            return;
        } 

        res.json({
            success: true,
            status: 200,
            message: 'User is created',
            data:user.username,
            error:null

        });
    })

}


let getUser = (req,res) => {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let data;
    if(email.length > 0){
        data = {
            email:email
        }
    } else if(username.length > 0){
        data = {
            username:username
        }
    }else{
        res.json({
            success:false,
            status: 400,
            message:'Email or username is not provided.',
            data:null,
            error:'Email or username is not provided.'
        });
    }

    User.findOne(data, (err, user) => {
        if (err) {
            res.json({
                success:false,
                status: 0,
                message: "Failed to find user",
                data:null,
                error: err
            });
        }
        if (!user) {
            res.json({
                success:false,
                status: 404,
                message:'User not found',
                data:null,
                error:'User not found'
            });
        }

       try {
        user.comparePassword(password,user.password).then(match =>{
            if(!match){
                res.json({
                    success: false,
                    status: 403,
                    message: 'Invalid password',
                    data:null,
                    error:'Invalid username or password'
                });
            }else{
                res.json({
                    success: true,
                    status: 200,
                    message: 'User is found',
                    data:user,
                    error:null
                });
            }
        });
       } catch (error) {
           console.log(error);
           res.json({
            success: false,
            status: 403,
            message: 'Invalid password',
            data:null,
            error:error
        });
       }
       
    });

}


let getAllUsers = (req,res) => {
    User.find({}, function (err, users) {
        if (err) {
            res.json({
                success:false,
                status: 400,
                message:"Failed to get users",
                data:null,
                error: err
            });
            return;
        }

        res.json({
            success: true,
            status: 200,
            message: 'getAllUsers success',
            data:users,
            error:null
        });
    });
}

let getLocalGuides = (req,res) => {
    let longitude = Number(req.query.longitude);
    let latitude = Number(req.query.latitude);

    User.find({
        guide_location:
        { $near :
           {
             $geometry: { type: "Point",  coordinates: [ longitude, latitude ] },
             $minDistance: 0,
             $maxDistance: 5000 //within 5km
           }
        },
        userType:'Local_Assistent'
    }).exec((err,local_guides)=> {
        if(err){
            console.log(err);
            res.json({
                success:false,
                status: 400,
                message:"Error in getting local guides by GPS location",
                data:null,
                error: err
            });
            return;
        }else{
            res.json({
                success:true,
                status: 200,
                message:local_guides.length+" local guides found near given location.",
                data:local_guides,
                error:null
            });    
           
        }
    });
}



module.exports = {addUser, getUser, getAllUsers,getLocalGuides};
