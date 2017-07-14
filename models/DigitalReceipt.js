const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DigitalReceiptSchema = new Schema({
    name: String,
    line_items: [{
        name: String,
        value: Number,
    }],
    total: Number,
    associated_users: [{phoneNumber: String, lineItems: []}],
    owner: {type: Schema.Types.ObjectId, ref: 'User'}
}, { collection: 'digital_receipts'});
const DigitalReceipt = mongoose.model('DigitalReceipt', DigitalReceiptSchema);
module.exports.DigitalReceipt = DigitalReceipt;