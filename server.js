const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const MongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/split_saver';
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var db;
MongoClient.connect(mongoUrl, (err, database) => {
    if(err) {
        return console.log(err);
    } else {
        console.log("Successfully connected to : ", mongoUrl);
        db = database;
        var server = app.listen(process.env.PORT || 8081, () => {
            const port = server.address().port;
            console.log("Server is listening at http://localhost:%s", port);
        });
    }
});

app.get('/', function (req, res) {
   console.log("pulsecheck");
   res.send('Hey i am alive');
})
app.post('/user', function (req, res) {
    console.log("Creating User");
    if (!req.body.phoneNumber) {
        return res.status(400).send("Missing Phone Number");
    }
    const userBody = {
        phone_number: req.body.phoneNumber,
    }
    userExists(userBody, (err, doesExist) => {
        if (err) return res.status(400).send("DB error");
        if (doesExist) return res.status(400).send("User already exists");
        db.collection('users').save(userBody, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).send("DB error");
            }
            return res.status(200).send("User Created");
        }) 
    });
})

const userExists = (userBody, cb) => {
    db.collection('users').find(userBody).toArray((err, result) => {
        if (err) return cb(err);
        else {
            return cb(null, result.length > 0);
        }
    });
}
