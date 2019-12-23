const mongoose = require('mongoose');
const GeoJSON = require('mongoose-geojson-schema');

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    name: {type: String, required: true, unique:true},
    location:{
        type: mongoose.Schema.Types.Point,
        required:true
      },
    description:{type: String, required: true, max: 500},
    type:{ type: [String],
        enum: ['Historical','Heritage' ,'Religious','Nature','Leisure','Adventure','Cultural','Wildlife'],
        required:true },
    image:{type:[String]},
    user_posted:{type:Schema.Types.ObjectId,ref:'User'},
    date_posted:{type: Date, default: Date.now}

});

module.exports = mongoose.model('Place', PlaceSchema);