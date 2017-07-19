const express = require('express');
const router = express.Router();
const {DigitalReceipt} = require('../models/DigitalReceipt');
const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

router.post('/', (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    if (!phoneNumber || !req.body.digitalReceiptId) {
        return res.status(400).send("Missing parameter");
    }
    DigitalReceipt.findById(req.body.digitalReceiptId).populate("owner").exec((err, digitalReceipt) => {
        createDigitalReceiptMessage(digitalReceipt)
        .then((baseMessage) => {
            return addAmountDue(baseMessage, digitalReceipt.associatedUsers[phoneNumber], digitalReceipt.owner.name);
        })
        .then((message) => {
            client.messages.create({
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber,
                body: message,
            }, (err, message) => {
                if (err) {
                    console.error(err.message);
                    return res.status(400).send("Error in Sending notification");
                } else {
                    return res.status(200).send("Notification successfully sent!");
                }
            });
        });
    });
})

router.post('/bulk', (req, res) => {
    if (!req.body.digitalReceiptId) {
        return res.status(400).send("Missing parameter");
    }
    DigitalReceipt.findById(req.body.digitalReceiptId)
    .populate("owner")
    .exec((err, digitalReceipt) => {
        if (err || !digitalReceipt || !digitalReceipt.associatedUsers) {
            if (err) console.log(err);
            return res.status(400).send("Invalid digital receipt");
        }
        createDigitalReceiptMessage(digitalReceipt).then((baseMessage) => {
            let promises = Object.keys(digitalReceipt.associatedUsers).map((phoneNumber) => {
                return new Promise((resolve, reject) => {
                    if (!digitalReceipt.associatedUsers[phoneNumber]) {
                        return reject("Invalid Associated User");
                    }
                    addAmountDue(baseMessage, digitalReceipt.associatedUsers[phoneNumber], digitalReceipt.owner.name).then((message) => {
                        client.messages.create({
                            from: process.env.TWILIO_PHONE_NUMBER,
                            to: phoneNumber,
                            body: message,
                        }, (err, message) => {
                            if (err) {
                                return reject(err);
                            } else {
                                resolve();
                            }
                        });
                    });
                });
            });
            Promise.all(promises)
                .then(() => {
                    return res.status(200).send("Notifications successfully sent!");
                })
                .catch((err) => {
                    console.error(err);
                    return res.status(400).send("Error in Sending notification");
                });
        });
    });
})

const createDigitalReceiptMessage = (digitalReceipt, associatedLineItems) => {
    return new Promise((resolve) => {
        let message = "For Digital Receipt (" + digitalReceipt.name + ")\n\n";
        let lineItemsRequests = digitalReceipt.lineItems.map((item) => {
            return new Promise((resolve) => {
                message += (item.name || "") + "\t\t$" + item.value + "\n";
                resolve();
            });
        });
        Promise.all(lineItemsRequests).then(() => {
            message += "\nFinal Amount :\t\t$" + digitalReceipt.total + "\n\nHow Much You Owe:\n\n";
            resolve(message);
        });
    });
}

const addAmountDue = (baseMessage, associatedCosts, userName) => {
    let message = "" + baseMessage;
    return new Promise((resolve) => {
        let lineItemsRequests = associatedCosts.lineItems.map((item) => {
            return new Promise((resolve) => {
                message += (item.name || "") + "\t\t$" + item.value + "\n";
                resolve();
            });
        });
        Promise.all(lineItemsRequests).then(() => {
            message += `\nTotal Amount Owed to ${userName}:\t$${associatedCosts.total}`;
            resolve(message);
        });
    });
}

module.exports = router;
