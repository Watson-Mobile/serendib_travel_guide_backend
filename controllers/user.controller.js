const User = require('../models/user.model');

//Simple version, without validation or sanitation
exports.user = function (req, res) {
    res.send('Greetings from the User controller!');
};