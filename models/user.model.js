const mongoose = require('mongoose');
require('mongoose-type-email');
const GeoJSON = require('mongoose-geojson-schema');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {type: String, required: true, max: 100},
    lastname: {type: String, required: true,max:100},
    username:{type: String, required:true,max:20,unique:true},
    email:{type:mongoose.SchemaTypes.Email , required:true,unique:true},
    userType:{ type: String,
               enum: ['Admin', 'Local_Assistent','Traveler'],
               required:true },
    telephone_number:{type:[Number],unique:true,required:function(){this.userType=='Local_Assistent'}},
    nic_num:{type:String,unique:true,required:function(){this.userType=='Local_Assistent'}},
    guide_location:{
        type: mongoose.Schema.Types.MultiPoint,
        required:function(){this.userType=='Local_Assistent'}
      },
    password:{type:String,required:true}
});

UserSchema.index({ guide_location: "2dsphere" });


UserSchema.pre('save',function (next) {
    var user = this;
  
    if(!user.isModified('password'))return next();

    bcrypt.genSalt(10, function(err, salt) {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {

            if(err) return next(err);
            
            // Store hash in your password DB.
            user.password = hash;
            next();

        });
    });
  
  });
  
  UserSchema.methods.comparePassword = (password,hash) => {
    return bcrypt.compare(password,hash);
  
  }

// Export the model
module.exports = mongoose.model('User', UserSchema);