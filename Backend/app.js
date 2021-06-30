const express = require('express')
const bodyParser= require('body-parser')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/splitpaydb'
const app = express()
app.use(bodyParser.urlencoded({ extended: true, limit:'30mb' }));
app.use(bodyParser.json({extended: true}))
const path = require('path')
mongoose.connect(url)
const conn = mongoose.connection

conn.on('open', () => {
    console.log("Success")
})

app.use(express.json())

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/css', express.static(__dirname + 'public/images'))

app.get("", (req, res) => {
    res.sendFile(__dirname + '/views/pay.html')
})

app.get('/home', (req,res) => {
    res.sendFile(__dirname + '/views/home.html')
})
// app.post("/pays", (req,res) => {
//     console.log(req.body)
// })

const paymentDetails = require("./server/routes/payment")
app.use('/payment',paymentDetails)

app.listen(9000, () =>{
    console.log("Server Started")
})