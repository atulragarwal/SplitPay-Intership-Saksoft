const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/splitpaydb'
const app = express()
mongoose.connect(url)
const conn = mongoose.connection

conn.on('open', () => {
    console.log("Success")
})

app.use(express.json())

const paymentDetails = require("./routes/payment")
app.use('/payment',paymentDetails)

app.listen(9000, () =>{
    console.log("Server Started")
})