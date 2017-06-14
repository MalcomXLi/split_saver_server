const express = require('express');
const mongodb = require('mongodb');

const app = express();
const MongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/split_saver';

MongoClient.connect(mongoUrl, (err, db) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Successfully connected to : ", mongoUrl);
    }
});
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('Hello GET');
})

var server = app.listen(process.env.PORT || 8081, () => {
    const port = server.address().port;
    console.log(server.address());
    console.log("Server is listening at http://localhost:%s", port);
});