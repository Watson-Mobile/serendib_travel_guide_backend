const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VisitSchema = new Schema({
    place: {type:Schema.Types.ObjectId,ref:'Place'},
    user: {type:Schema.Types.ObjectId,ref:'User'},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Visit', VisitSchema);