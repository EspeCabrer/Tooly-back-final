const express = require("express");
const router = express.Router();
const Review = require("../models/Review.model");
const Product = require("../models/Product.model");

//<------------------RETRIEVES A ESPECIFIC REVIEW BY ID------------------------------->

router.get("/review/:id", (req, res) => {
	const { id } = req.params;
    Review.findById(id)
	    .populate('product')
        .populate('user')
	    .then((review) => {
		  	res.status(200).json(review)})
	    .catch((error) => {
			console.log("error: ", error)
			res.json(error)}
			);
});

//<------------------ROUTE TO POST A REVIEW --------------------------------------->

router.post("/review", (req,res,next)=>{
    const {content, rating, productId, user} = req.body;   
    Review.create({content, rating, product: productId, user})
        .then((newReview)=>{
            Product.findByIdAndUpdate(productId,{
                $push:{reviews: newReview._id}
            }, {new:true})
            .then(reviewedProduct => {
                let newAverageRating = (reviewedProduct.averageRating + rating) / (reviewedProduct.reviews.length)
                Product.findByIdAndUpdate(productId,{
                    averageRating: newAverageRating}
                ,{new:true})
                .then(()=>{res.json("ok")   
            })
            res.json(newReview)
        })
        .catch((err) => res.json(err));
 })
})

module.exports = router;