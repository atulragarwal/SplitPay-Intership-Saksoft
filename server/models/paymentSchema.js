const mongoose = require('mongoose')

const paySchema = new mongoose.Schema({
    payer: {
        type: String,
        required: true
    },
    payee: {
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    note : {
        type: String
    }
})

module.exports = mongoose.model('details', paySchema)
