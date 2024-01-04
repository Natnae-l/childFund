const mongoose = require('mongoose');

async function connectDB(){
    try {
        await mongoose.connect(process.env.MongoDB)
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = connectDB;