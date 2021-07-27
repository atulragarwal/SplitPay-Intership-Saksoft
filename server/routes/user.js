const { request } = require('express')
const express = require('express')
const userSchema = require('../models/userSchema')
const userRouter = express.Router()
const ObjectId = require('mongodb').ObjectID
const bcryptjs = require('bcryptjs')
const multer = require('multer')

const fileStorage = multer.diskStorage({
    destination : function(req, file, callback){
        callback(null, 'public/uploads')
    },

    filename : function(req, file, callback){
        callback(null, file.originalname)
    }
})

const upload = multer({
    storage : fileStorage,
    limits : {
        fileSize : 10000000
    }
})

const userDetails = require('../models/userSchema')

userRouter.post('/', upload.single('profile_pic'), async(req,res) =>{
    const hashPass = await bcryptjs.hash(req.body.uPass,10)
    console.log(req)
    const makeUser = new userDetails({
        name: req.body.uName,
        emailId: req.body.uEmail,
        phoneNo : req.body.uNum,
        password: hashPass,
        userImage : req.file.filename
    })

    try{
        const makeNewUser = await makeUser.save()
        res.redirect('/login')
    }
    catch(err){
        res.send(err)
    }
})

userRouter.post('/',async(req,res) => {
    const loginDetails = await userDetails.find({emailId : req.body.uEmail}).toArray()
    .then(results => {
        res.json(loginDetails)
        console.log(results)
    })
    .catch(error => console.log(error))
    console.log(loginDetails)
})

module.exports = userRouter