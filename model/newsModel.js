const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    text: { required: true, type: String},
    link: {required: true, type: String},
    image: {required: true, type: String}
})

module.exports = mongoose.model('news', newsSchema);