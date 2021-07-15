const mongoose = require('mongoose')

const splitDetail = new mongoose.Schema({
    splitPayer : {
        type: String
    },
    splitAmount : {
        type : Number
    },
    splitPayee : {
        type : String
    },
    splitNote : {
        type : String
    }

})

module.exports = mongoose.model('splitpayment', splitDetail)