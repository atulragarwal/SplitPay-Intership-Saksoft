const express = require('express')
const bodyParser= require('body-parser')
const ObjectId = require('mongodb').ObjectID
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

app.get('/signup', (req,res) => {
    res.sendFile(__dirname + '/views/signup.html')
})
app.post('/updateDet', (req,res) => {
    // console.log(req.body)
    const makeUpdate = conn.collection('details').updateOne({payer : req.body.payerNum},
    {
        $set : {payee : req.body.updateVal}
    })
    .then(results =>{
        res.redirect('/updatePay')
    })
    .catch(error => {console.log(error)})
    // console.log(makeUpdate)
})

app.get('/deletePay', (req,res) =>{
    res.sendFile(__dirname + '/views/deletePay.html')
})

app.post('/deleteDet', (req,res) => {
    // console.log(req.body)
    const makeUpdate = conn.collection('details').deleteOne(
        {payer : req.body.payerDel},
    )
    .then(result =>{
        console.log(result)
    })
    .catch(error => {console.log(error)})
})

// app.get('/checkUser', (req,res) =>{
//     const checkAll = conn.collection('userdetails').find().toArray().then(results => {console.log(results)})
// })
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

app.get('/login', (req,res) => {
    res.sendFile(__dirname + '/views/login.html')
})

app.post('/createToken', async(req,res) => {
    try{
        const checkAll = await conn.collection('userdetails').findOne({emailId : req.body.uEmail})
        if(checkAll.password === req.body.uPass){
            res.redirect('/home')
        }
    }
    catch(err){
        console.log(err)
    }
})

const paymentDetails = require("./server/routes/payment")
app.use('/payment',paymentDetails)

const userCreate = require("./server/routes/user")
app.use('/createUser', userCreate)

// const tokenCreate = require("./server/routes/user")
// app.use('/createToken', tokenCreate)

app.listen(9000, () =>{
    console.log("Server Started")
})
