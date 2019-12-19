const express = require('express');
const bodyParser = require('body-parser');
const user = require('./routes/user.route'); // initialize our express app
const app = express();

let port = 1234;

app.use('/user', user);

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});