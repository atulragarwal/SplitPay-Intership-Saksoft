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
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/css', express.static(__dirname + 'public/images'))

app.get('/updatePay', (req,res) => {
    res.sendFile(__dirname + '/views/updatePay.html')
})
app.post('/updateDet', (req,res) => {
    // console.log(req.body)
    const makeUpdate = conn.collection('details').findOneAndUpdate(
        {payee : 'Geeta'},
        {
            $set : {
                payer : req.body.payer,
                payee : req.body.payee,
                amount : req.body.amount
            }
        },
        {upsert : true, new: true}
    )
    .then(result =>{
        console.log(result)
    })
    .catch(error => {console.log(error)})
})

app.post('/deleteDet', (req,res) => {
    // console.log(req.body)
    const makeUpdate = conn.collection('details').deleteOne(
        {payee : 'Geeta'},
    )
    .then(result =>{
        console.log(result)
    })
    .catch(error => {console.log(error)})
})

app.get("/", (req,res)=> {
    const cursor = conn.collection('details').find().toArray()
    .then(results => {
        console.log("Fetch Success")
        res.render('pay.ejs', {details: results})
    })
    .catch(error => console.log(error))
    console.log(cursor)
})

app.get("", (req, res) => {
    res.sendFile(__dirname + '/views/pay.html')
})
// app.get('/home', (req,res) => {
//     res.sendFile(__dirname + '/views/home.html')
// })

app.get('/home', (req,res) =>{
    const cursor1 = conn.collection('details').find().toArray()
    .then(results => {
        console.log("Home Fetch Success")
        res.render('home.ejs', {details: results})
    })
    .catch(error => console.log(error))
    console.log(cursor1)
})
// app.post("/pays", (req,res) => {
//     console.log(req.body)
// })

const paymentDetails = require("./server/routes/payment")
app.use('/payment',paymentDetails)

app.listen(9000, () =>{
    console.log("Server Started")
})
