const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction.model")
const mongoose = require("mongoose")

//<-----------------ROUTE TO GET ALL TRANSACTIONS WHERE THE CHAT USER HAVE BEEN INVOLVED-------------------------------------------------------------------------------------------------------->

router.get("/chat/:id", (req, res) => {
	const {id} = req.params 

 Transaction.find()
	.populate ("owner")
	.populate ("renter")
	.then((transactions) => {
		res.json(transactions)}
		)
	.catch((err) => {
		console.log("error: ", err)
		res.json(err)})
})

module.exports = router