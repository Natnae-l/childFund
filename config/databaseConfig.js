const mongoose = require('mongoose');

async function connectDB(req, res, next){
    try {
        await mongoose.connect(process.env.MongoDB)
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = connectDB;