const { request } = require('express')
const express = require('express')
const router = express.Router()

const details = require('../models/paymentSchema')

router.get('', async(req, res) =>{
    try{
        const paymentDetails = await details.find()
        res.json(paymentDetails)
        // console.log('hello')
        // console.log(paymentDetails)
    }
    catch(err){
        res.send(err)
    }
})

// router.get('/:id', async(req, res) =>{
//     try{
//         const paymentDetail = await details.findById(req.params.id)
//         res.json(paymentDetail)
//     }
//     catch(err){
//         res.send(err)
//     }
// })

router.post('/', async(req,res) =>{
    const makePayment = new details({
        payer: req.body.payer,
        payee: req.body.payee,
        amount: req.body.amount
    })

    try{
        const makeNew = await makePayment.save()
        res.redirect('/')
        res.json(makeNew)
    }
    catch(err){
        res.send(err)
    }
})

module.exports = router