const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    firstname: {type: String, required: true, max: 100},
    lastname: {type: String, required: true,max:100},
});


// Export the model
module.exports = mongoose.model('User', UserSchema);