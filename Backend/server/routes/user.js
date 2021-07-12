const { request } = require('express')
const express = require('express')
const userSchema = require('../models/userSchema')
const userRouter = express.Router()
const ObjectId = require('mongodb').ObjectID
const bcrypt = require('bcrypt')

const userDetails = require('../models/userSchema')

userRouter.post('/', async(req,res) =>{
    const hashPass = await bcrypt.hash(req.body.uPass,10)
    const makeUser = new userDetails({
        name: req.body.uName,
        emailId: req.body.uEmail,
        phoneNo : req.body.uNum,
        password: hashPass
    })

    try{
        const makeNewUser = await makeUser.save()
        res.redirect('/login')
    }
    catch(err){
        res.send(err)
    }
})

userRouter.post('/', async(req,res) => {
    const loginDetails = await userDetails.find({emailId : req.body.uEmail}).toArray()
    .then(results => {
        res.json(loginDetails)
        console.log(results)
    })
    .catch(error => console.log(error))
    console.log(loginDetails)
})

module.exports = userRouter