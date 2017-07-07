const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {User} = require('./models/User');
const {DigitalReceipt} = require('./models/DigitalReceipt');
const fs = require('fs');
const user = require('./controllers/user.js');
const digitalReceipt = require('./controllers/digitalReceipt.js');

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/split_saver';
mongoose.connect(mongoUrl, {useMongoClient: true}, function(error) {
    if (error) {
        console.error.bind(console, "MongoDB connection Error")
    }
});

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


const server = app.listen(process.env.PORT || 8081, () => {
    const port = server.address().port;
    console.log("Server is listening at http://localhost:%s", port);
});

app.use('/user', user);
app.use('/digitalreceipt', digitalReceipt);
