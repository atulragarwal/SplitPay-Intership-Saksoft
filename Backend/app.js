const express = require('express')
const bodyParser= require('body-parser')
const ObjectId = require('mongodb').ObjectID
const mongoose = require('mongoose')
const url = 'mongodb://localhost/splitpaydb'
const app = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
app.use(bodyParser.urlencoded({ extended: true, limit:'30mb' }));
app.use(bodyParser.json({extended: true}))
const path = require('path')
require('dotenv').config()
const session = require('express-session')
let accessToken
let user
const details = require('./server/models/paymentSchema')
const splitpayment = require('./server/models/splitSchema')
const passport = ('passport')
// const initializePassport = require('./passportConfig')
// initializePassport(passport, checkAll.emailId)
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
        res.redirect('/home')
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
        // console.log(result)
        res.redirect('/home')
    })
    .catch(error => {console.log(error)})
})

// app.get('/checkUser', (req,res) =>{
//     const checkAll = conn.collection('userdetails').find().toArray().then(results => {console.log(results)})
// })

// const cursor = conn.collection('details').find({
//     $and : [
//         {payer : {req.body.payerNum}},{payee : {req.body.payeeNum}}
//     ]
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
        // console.log(results)
        res.render('home.ejs', {details: results})
    })
    .catch(error => console.log(error))
    console.log(cursor1)
})
app.post("/pays", (req,res) => {
    console.log(req.body)
})

app.get('/login', (req,res) => {
    res.sendFile(__dirname + '/views/login.html')
})

app.post('/createToken', async(req,res) => {
    try{
        const checkAll = await conn.collection('userdetails').findOne({emailId : req.body.uEmail})
        if(bcrypt.compare(checkAll.password, req.body.uPass)){
            user = checkAll
            accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            res.redirect('/home')
            // console.log(accessToken)
            console.log('Login Success')
        }
    }
    catch(err){
        console.log(err)
    }
})

function authenticateToken(req,res,next)
{
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.json(err)
        req.user = user
        next()
    })
}

app.get('/fetchUserDetail', authenticateToken, async(req,res) => {
    res.json(user)
})

app.get('/fetchTransactions', authenticateToken, async(req, res) => {
    const userTrans = await conn.collection('details').find({$or : [{payer : user.phoneNo.toString()}, {payee : user.phoneNo.toString()}]}).toArray()
    res.json(userTrans)
})

app.get('/fetchToken', async(req,res) => {
    res.json(accessToken)
})

app.post('/makeSplit', authenticateToken, async(req, res)=>{
    const userLength = req.body.length
    const amtDiv = req.body.amount/userLength
    let splitUsers = req.body.payee
    const splitReason = req.body.reason
    // splitUsers.push(user.phoneNo)
    let i = 0
    for(i=0;i<userLength-1;i++){

        const userSplit = await conn.collection('splitpayments').find({$and:[{splitPayer : user.phoneNo.toString()}, {splitPayee : splitUsers[i].toString()}]}).toArray()
        if(userSplit.length == 0)
        {
            let newSplit = new splitpayment({
                splitPayer : user.phoneNo,
                splitAmount : amtDiv,
                splitPayee : splitUsers[i],
                splitNote : splitReason
            })
            let splitSave = await newSplit.save()
        }
        else{
            let paymentBalance = Number(userSplit[0].splitAmount) + Number(amtDiv)
            const splitUpdate = await conn.collection('splitpayments').findOneAndUpdate({$and : [{splitPayer : user.phoneNo.toString()}, {splitPayee : splitUsers[i].toString()}]}, {$set : {splitAmount : Number(paymentBalance)}})
        }
    }
    // console.log(splitUsers)
})

app.get('/splits',async(req,res) => {
    // const userCollects = await conn.collection('details').find({payer})
    res.render('newSplit.ejs')
})

app.get('/getSplits', async(req,res) => {
    res.sendFile(__dirname + '/views/splitCollect.html')
})

app.get('/showCollect', authenticateToken, async(req,res) => {
    const splitCollect = await conn.collection('splitpayments').find({splitPayer : user.phoneNo.toString()}).toArray()
    res.json(splitCollect)
})

app.get('/showDebt', authenticateToken, async(req,res) => {
    const splitDebt = await conn.collection('splitpayments').find({splitPayee : user.phoneNo.toString()}).toArray()
    res.json(splitDebt)
})

app.get('/splitDebt', async(req,res) => {
    res.sendFile(__dirname + '/views/splitDebt.html')
})

app.get('/settleDebt', async(req,res) => {
    res.sendFile(__dirname + '/views/settleUp.html')
})

app.get('/settleUser/:id',authenticateToken, async(req,res) => {
    // console.log(req.params['id'])
    const splitBetween = await conn.collection('splitpayments').find({$and : [{splitPayer : user.phoneNo.toString()}, {splitPayee : req.params['id'].toString()}]}).toArray()
    res.json(splitBetween)
})

app.get('/settleOption', async(req,res) => {
    res.sendFile(__dirname + '/views/settleOptions.html')
})

app.get('/settlePayment/:id', authenticateToken, async(req,res) => {
    const settleCollect = await conn.collection('splitpayments').deleteOne({$and : [{splitPayer : user.phoneNo.toString()}, {splitPayee : req.params['id'].toString()}]})
    .then(ans => {
        res.sendFile(__dirname + '/views/paymentComplete.html')
    })
    .catch(err => {
        console.log(err)
    })
})



app.post('/payment', authenticateToken, async(req,res) => {
    const makePayment = new details({
        payer: user.phoneNo,
        payee: req.body.payee,
        amount: req.body.amount,
        note: req.body.note
    })
    try{
        const makeNew = await makePayment.save()
        res.redirect('/')
        // res.json(makeNew)
    }
    catch(err){
        res.send(err)
    }

})

const userCreate = require("./server/routes/user")
const initialize = require('./passportConfig')
app.use('/createUser', userCreate)

// const tokenCreate = require("./server/routes/user")
// app.use('/createToken', tokenCreate)

app.listen(9000, () =>{
    console.log("Server Started")
})