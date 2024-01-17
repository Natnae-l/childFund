const mongoose = require('mongoose');

async function connectDB(){
        await mongoose.connect(process.env.MongoDB)
}

module.exports = connectDB;