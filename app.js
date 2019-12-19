const express = require('express');
const bodyParser = require('body-parser');
const user = require('./routes/user.route'); // initialize express app
let mongoose = require('mongoose');
let config = require('./config');
let morgan = require('morgan');

const app = express();

let port = process.env.PORT || 9000;

// Parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));     //logging middleware

// API file for interacting with MongoDB
mongoose.connect(config.database,{ useUnifiedTopology: true }, function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('database connected');
    }
});

app.use('/api', user);

app.listen(port, function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('app is listing on port: '.concat(port));
    }
});