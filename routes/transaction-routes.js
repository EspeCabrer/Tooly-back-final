

const express = require("express");
const router = express.Router();
const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const Transaction = require("../models/Transaction.model")
const User = require("../models/User.model")
const Product = require("../models/Product.model")

//<------------------ROUTE TO GET A TRANSACTION--------------------------------------->

router.get("/transaction/profile/:id", (req, res, next) => {
   
   const id = req.params.id;

  Transaction.find({ $or: [{ owner: id }, { renter: id }] })
    .populate("product")
    .populate("renter")
    .populate("owner")

    .then((allTransactions) => {
        res.json(allTransactions)})
    .catch((err) => res.json(err));
});

//<------------------ROUTE TO POST A TRANSACTION --------------------------------------->

router.post("/transaction", (req, res, next) => {
  
  const { _id, owner } = req.body.product;
  const { endDate } = req.body;
  const { startDate } = req.body;
  const { excludedDays,userId } = req.body;

  const dateFormater = (str) => {
    const startYear = str.slice(0, 4);
    const startMonth = str.slice(5, 7);
    const startDay = str.slice(8, 10);
    return `${startDay}-${startMonth}-${startYear}`;
  };

  let formatedStartDate = dateFormater(startDate);
  let formatedEndtDate = dateFormater(endDate);

  Transaction.create({
    renter: userId,
    owner: owner,
    startDate: formatedStartDate,
    endDate: formatedEndtDate,
    product: _id,
  })
    .then((createdTransaction) => {
      for (let i = 0; i < excludedDays.length; i++) {
        Product.findByIdAndUpdate(
          _id,
          { $push: { bookDates: excludedDays[i] } },
          { new: true }
        )
          .then((response) => res.json(response))
          .catch((err) => res.json(err));
      } return res.json (createdTransaction)
    })
    .catch((err) => res.json(err));
});

module.exports = router