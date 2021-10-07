const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  username:String,
  fullName: String,
  password: String,
  email: String,
  address:{
    street: {type: String, default: "street"},
    number: {type: String, default: "number"},
    city: {type: String, default: "city"},
    postalCode: {type: String, default:"postalCode"}
  },
  location:{
    lat:String,
    lng:String
  },
  tel: {type: Number, default: 000000000},
  profileImg: {type: String, default: "https://w7.pngwing.com/pngs/858/581/png-transparent-profile-icon-user-computer-icons-system-chinese-wind-title-column-miscellaneous-service-logo.png"},
  products: [{
    type: Schema.Types.ObjectId,
    ref: "Product",
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
