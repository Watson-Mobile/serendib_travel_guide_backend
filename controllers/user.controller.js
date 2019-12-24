const User = require('../models/user.model');

let addUser = (req,res) => {
    let user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username:req.body.username,
        email:req.body.email,
        userType:req.body.userType,
        telephone_number:req.body.telephone_number,
        password:req.body.password,
        nic_num:req.body.nic_num,
        guide_location: {
            type: "MultiPoint",
            coordinates: req.body.guide_location
        },
    });

    user.save((err, user) => {
        if (err) {
            res.json({
                success:false,
                status: 400,
                message:"Failed to save user",
                error: err
            });
            return;
        } 

        res.json({
            success: true,
            status: 200,
            message: 'User is created',
            data:user.username
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
            message:'Email or username is not provided.'
        })
    }

    User.findOne(data, (err, user) => {
        if (err) {
            res.json({
                success:false,
                status: 0,
                message: "Failed to find user",
                error: err
            });
        }
        if (!user) {
            res.json({
                success:false,
                status: 404,
                message:'User not found'
            });
        }

        user.comparePassword(password,user.password).then(match =>{
            if(!match){
                res.json({
                    success: false,
                    status: 403,
                    message: 'Invalid password',
                });
            }else{
                res.json({
                    success: true,
                    status: 200,
                    message: 'User is found',
                    data:user
                });
            }
        });
    });

}


let getAllUsers = (req,res) => {
    User.find({}, function (err, users) {
        if (err) {
            res.json({
                success:false,
                status: 400,
                message:"Failed to get users",
                error: err
            });
            return;
        }

        res.json({
            success: true,
            status: 200,
            message: 'getAllUsers success',
            data:users
        });
    });
}



module.exports = {addUser, getUser, getAllUsers};
