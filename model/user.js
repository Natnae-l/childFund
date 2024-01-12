const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{required: true, type: String},
    lastName:{required: true, type: String},
    email: {required: true, type: String},
    password: {required: true, type: String, minLength: 8},
    createdAt: {default: Date.now,  type: Date},
    isAdmin: {default: false, type: Boolean},
    donationPlan: {type: String}
})

const User = mongoose.model('User', userSchema);


module.exports = User;