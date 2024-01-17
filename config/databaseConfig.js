const mongoose = require('mongoose');

function connectDB(){
         mongoose.connect(process.env.MongoDB)
}

module.exports = connectDB;