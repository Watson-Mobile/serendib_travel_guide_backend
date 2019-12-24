const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    comment: {type:String, max:200},
    rating: {type:Number, required:true},
    image:{type:[String]},
    place:{type:Schema.Types.ObjectId,ref:'Place', required:true},
    user_posted:{type:Schema.Types.ObjectId,ref:'User', required:true},
    date_posted:{type: Date, required:true, default: Date.now}

});

module.exports = mongoose.model('Review',ReviewSchema);