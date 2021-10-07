const { Schema, model } = require("mongoose");
const productSchema = new Schema({
    name: String,
    description: String,
    amount: Number,
    photo: String,
    owner:{
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    category:String,
    bookDates:[],
    adquisitionYear: String,
    reviews:[{
      type: Schema.Types.ObjectId,
      ref: "Review"
    }],
    averageRating: Number,
    
});
const Product = model("Product", productSchema);
module.exports = Product;