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
        owner: req.session.user._id
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

router.get('/', function (req, res) {
    DigitalReceipt.find({}, (err, digitalReceipts) => {
        return res.status(200).json(digitalReceipts || []);
    });
})

router.get('/:id', function (req, res) {
    DigitalReceipt.findById(req.params.id, (err, digitalReceipts) => {
        return res.status(200).json(digitalReceipts || []);
    });
})


module.exports = router;
