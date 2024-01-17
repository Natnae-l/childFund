const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const subSchema = new Schema({
    email: {
        required: true, type: String
    }
})

module.exports = mongoose.model('subscriber', subSchema);