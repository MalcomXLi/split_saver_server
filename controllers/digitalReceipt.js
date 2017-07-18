const mongoose = require('mongoose');
const {DigitalReceipt} = require('../models/DigitalReceipt');
const express = require('express')
const router = express.Router()

router.post('/', function (req, res) {
    const body = req.body;
    const digitalReceiptBody = {
        name: body.name,
        lineItems: body.lineItems,
        total: body.total,
        associatedUsers: body.associatedUsers,
        owner: req.session.user._id,
        createdAt: Date.now(),
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

// Sort this chronologically
router.get('/', function (req, res) {
    DigitalReceipt.find({owner: req.session.user._id}, null, {sort: {created_at: -1}}, (err, digitalReceipts) => {
        if (err) {
            console.log("Error Getting Receipts: " + JSON.stringify(err, null, 4));
            return res.status(400).send("Error Getting Receipts");
        }
        return res.status(200).json(digitalReceipts || []);
    });
})

router.get('/:id', function (req, res) {
    DigitalReceipt.findById(req.params.id, (err, digitalReceipts) => {
        if (err) {
            console.log("Error Getting Receipt: " + JSON.stringify(err, null, 4));
            return res.status(400).send("Error Getting Receipt");
        }
        return res.status(200).json(digitalReceipts || []);
    });
})


module.exports = router;
