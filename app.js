const express = require('express');
const bodyParser = require('body-parser');
const user = require('./routes/user.route'); // initialize express app
let mongoose = require('mongoose');
let config = require('./config');
let morgan = require('morgan');
var http = require('http');


const app = express();

let port = process.env.PORT || 9000;

// Parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));     //logging middleware


mongoose.set('useCreateIndex', true)
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

let server = http.createServer(app);

server.listen(port, function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('app is listing on port: '.concat(port));
    }
});