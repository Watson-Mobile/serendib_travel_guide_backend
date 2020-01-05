const express = require('express');
const bodyParser = require('body-parser');
let mongoose = require('mongoose');
let config = require('./config');
let morgan = require('morgan');
const https = require('http');
const fs = require("fs");

const user = require('./routes/user.route'); // initialize express app
const place = require('./routes/place.route');
const visit = require('./routes/visit.route');
const review = require('./routes/review.route');
const test = require('./routes/test.route');


const app = express();

let port = process.env.PORT || 9000;

// Parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));     //logging middleware


mongoose.set('useCreateIndex', true)
// API file for interacting with MongoDB
mongoose.connect(config.database_prod,
   function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('database connected');
    }
});

app.use('/api', user);
app.use('/api', place);
app.use('/api',visit);
app.use('/api',review);
//app.use('/api', test);

const options = {
  key: fs.readFileSync('crypto-credentials/key.pem'),
  cert: fs.readFileSync('crypto-credentials/cert.pem')
};


let server = https.createServer(app);

server.listen(port, function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('app is listing on port: '.concat(port));
    }
});