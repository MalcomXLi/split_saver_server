const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DigitalReceiptSchema = new Schema({
    name: String,
    lineItems: [{
        name: String,
        value: Number,
    }],
    total: Number,
    associatedUsers: {},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt : {type: Date, required: true, default: Date.now}
}, { collection: 'digital_receipts'});
const DigitalReceipt = mongoose.model('DigitalReceipt', DigitalReceiptSchema);
module.exports.DigitalReceipt = DigitalReceipt;