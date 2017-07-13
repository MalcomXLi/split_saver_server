const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: String,
    phone_number: String,
});
const User = mongoose.model('User', UserSchema);
module.exports.User = User;