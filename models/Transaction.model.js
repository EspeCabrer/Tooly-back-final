const { Schema, model } = require("mongoose");

const transactionSchema = new Schema({
  
  renter: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User"
  }
  ,
  startDate: String,
  endDate: String,
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
 
    
});
const Transaction = model("Transaction", transactionSchema);
module.exports = Transaction;