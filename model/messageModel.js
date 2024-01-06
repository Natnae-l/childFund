const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    message: {required: true, type: String},
    user: {required: true, type: Schema.ObjectId, ref: 'User'},
    createdAt: {required: true, type: Date}
})

module.exports = mongoose.model('Message', messageSchema);