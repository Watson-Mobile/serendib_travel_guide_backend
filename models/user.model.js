const mongoose = require('mongoose');
require('mongoose-type-email');
const GeoJSON = require('mongoose-geojson-schema');

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
    password:{type:String,required:true,select:false},
});


UserSchema.pre('save',function (next) {
    var user = this;
  
    if(!user.isModified('password'))return next();
  
    bcrypt.hash(user.password, null, null, (err,hash) => {
      if(err) return next(er);
  
      user.password = hash;
      next();
  
    });
  
  });
  
  UserSchema.methods.comparePassword = (password) => {
    var user = this;
   //compare the user password with password stored in the database
    return bcrypt.compareSync(password, user.password)
  };
  
  

// Export the model
module.exports = mongoose.model('User', UserSchema);