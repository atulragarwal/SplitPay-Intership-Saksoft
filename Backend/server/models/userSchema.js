const mongoose = require('mongoose')

const userDetailSchema = new mongoose.Schema({
    name : {
        type: String
    },
    phoneNo : {
        type : Number,
        unique : true
    },
    emailId : {
        type : String,
        unique : true
    },
    password : {
        type : String
    }

})

module.exports = mongoose.model('userDetails', userDetailSchema)