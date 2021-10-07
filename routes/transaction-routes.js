

const express = require("express");
const router = express.Router();
const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const Transaction = require("../models/Transaction.model")
const User = require("../models/User.model")
const Product = require("../models/Product.model")

router.get("/transaction", isAuthenticated, (req, res, next) =>{

    const currentUserId = req.payload._id
    console.log('transaction:',currentUserId)

    Transaction.find( 
        {$or: [
            {owner:currentUserId},
            {renter:currentUserId}
          ]
        })
    .then(allTransactions => {res.json(allTransactions)
    
    console.log(allTransactions)})
    .catch(err => console.log(err))


})

router.post("/transaction" ,isAuthenticated, (req, res, next ) =>{


const token = req.payload
const {_id, ownerId} = req.body.product
const {endDate} = req.body
const {startDate} = req.body
const {excludedDays} = req.body

console.log(req.body)

console.log("excluded",excludedDays)
const dateFormater = (str) =>{

    const startYear = str.slice(0,4);
    const startMonth = str.slice(5,7);
    const startDay = str.slice(8,10);
    
    return `${startDay}-${startMonth}-${startYear}`

}

let formatedStartDate = dateFormater(startDate)
let formatedEndtDate = dateFormater(endDate)



    Transaction.create({
        renter:token._id, 
        owner:ownerId,
        startDate:formatedStartDate,
        endDate:formatedEndtDate,
        product:_id})
        
    .then(()=>{
        for(let i =0; i < excludedDays.length; i++){
            Product.findByIdAndUpdate(_id, { $push: {bookDates:excludedDays[i]}} , {new:true})
            .then(response => console.log(response))
        }

        
    })
    .catch(err => console.log(err))


})

module.exports = router