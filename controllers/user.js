const {User} = require('../models/User');
const express = require('express')
const router = express.Router()

router.post('/createUser', function (req, res) {
    console.log('Route createUser accessed');
    const body = req.body;
    if (!body.name) {
        return res.status(400).send("Missing Name");
    }
    if (!body.phoneNumber) {
        return res.status(400).send("Missing Phone Number");
    }
    const userBody = {
        name: body.name,
        phone_number: body.phoneNumber,
    }

    User.update(userBody, {$set: userBody}, {upsert: true}, (err) => {
        if (err) {
            console.log("error on saving user : " + err);
            return res.status(400).send("Error Creating User");
        } else {
            return res.status(200).send("User Created");
        }
    });
})
module.exports = router;
