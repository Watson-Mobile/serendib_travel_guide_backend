const mongoose = require('mongoose');
const GeoJSON = require('mongoose-geojson-schema');

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    name: {type: String, required: true, unique:true},
    other_names: {type:[String]},
    location:{
        type: mongoose.Schema.Types.Point,
        required:true
      },
    description:{type: String, required: true, max: 500},
    type:{ type: [String],
        enum: ['Historical','Heritage' ,'Religious','Nature','Leisure','Adventure','Cultural','Wildlife','Supermarket','Other'],
        required:true,
        default:'Other' },
    image:{type:[String],validate: [arrayLimit, '0 < num_images <= 5'],required:false},
    user_posted:{type:Schema.Types.ObjectId,ref:'User'},
    date_posted:{type: Date, default: Date.now},
    verified:{type:Boolean, default:false}

});

PlaceSchema.index({ 
  location: "2dsphere"});

PlaceSchema.index({ 
  location: "2dsphere",
  name:'text',
  description:'text',
  type:'text',
  other_names:'text'
}, { default_language: "none" });

function arrayLimit(val) {
    return val.length > 0 && val.length<=5;
  }

module.exports = mongoose.model('Place', PlaceSchema);