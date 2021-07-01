const mongoose = require('mongoose')

const userDetailSchema = new mongoose.Schema({
    name : {
        type: String
    },
    phoneNo : {
        type : Number
    },
    emailId : {
        type : String
    },
    password : {
        type : String
    }

})

module.exports = mongoose.model('userDetails', userDetailSchema)