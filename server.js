const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const {User} = require('./models/User');
const {DigitalReceipt} = require('./models/DigitalReceipt');
const fs = require('fs');
const user = require('./controllers/user');
const digitalReceipt = require('./controllers/digitalReceipt');
const notification = require('./controllers/notification');
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/split_saver';
mongoose.connect(mongoUrl, {useMongoClient: true}, function(error) {
    if (error) {
        console.error.bind(console, "MongoDB connection Error")
    }
});

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  cookieName: 'session',
  secret: 'split_server_secret',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

const server = app.listen(process.env.PORT || 8081, () => {
    const port = server.address().port;
    console.log("Server is listening at http://localhost:%s", port);
});

//Middleware
const requireLogin = (req, res, next) => {
    if (!req.user) {
        return res.status(400).send("Not Logged In");
    } else {
        next();
    }
};

app.use((req, res, next) => {
    if (req.session && req.session.user) {
        User.findById(req.session.user._id, (err, user) => {
            if (user) {
                req.user = user;
                req.session.user = user;  //refresh the session value
            }
            // finishing processing the middleware and run the route
            next();
        });
    } else {
        next();
    }
});
app.use('/user', user);
app.use('/digitalreceipt', requireLogin, digitalReceipt);
app.use('/notify', requireLogin, notification);


