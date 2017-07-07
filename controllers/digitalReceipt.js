const mongoose = require('mongoose');
const {DigitalReceipt} = require('../models/DigitalReceipt');
const express = require('express')
const router = express.Router()

router.post('/', function (req, res) {
    const body = req.body;
    const digitalReceiptBody = {
        name: body.name,
        line_items: body.lineItems,
        total: body.total,
        associated_users: body.associatedUsers,
        owner: mongoose.mongo.ObjectId(body.userId)
    }

    DigitalReceipt.update({name: digitalReceiptBody.name, owner: digitalReceiptBody.owner}, {$set: digitalReceiptBody}, {upsert: true}, (err, data) => {
        if (err) {
            console.log("error on saving digital receipt : " + err);
            return res.status(400).send("Error Creating Digital Receipt");
        } else {
            return res.status(200).send("Digital Receipt Created");
        }
    });
})

module.exports = router;
