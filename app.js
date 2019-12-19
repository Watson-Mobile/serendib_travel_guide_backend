const express = require('express');
const bodyParser = require('body-parser');
const user = require('./routes/user.route'); // initialize express app
const app = express();


app.use('/user', user);

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});