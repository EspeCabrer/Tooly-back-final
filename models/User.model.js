const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  username:String,
  fullName: String,
  password: String,
  email: String,
  address:{
    street: String,
    number: String,
    city: String,
    postalCode: String,
  },
  location:{
    lat:String,
    lng:String
  },
  tel: Number,
  profileImg: String,
  products: [{
    type: Schema.Types.ObjectId,
    ref: "Product"
  }],
  transactions:[{
    type: Schema.Types.ObjectId,
    ref: "Transaction"
  }],
  favorites:[{
    type: Schema.Types.ObjectId,
    ref: "Product"
  }],
  
});
const User = model("User", userSchema);
module.exports = User;
