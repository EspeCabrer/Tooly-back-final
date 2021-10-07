const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require ("../models/Product.model")
const User = require ("../models/User.model")

//<-----------------ROUTE TO LIST ALL THE PRODUCTS-------------------------------------->

router.get("/product", (req, res) => {

	Product.find ()
		.populate("reviews")
		.then((allProjects) => res.json(allProjects))
		.catch((err) => res.json(err))
})

//<-----------------ROUTE TO CREATE A NEW PRODUCT-------------------------------------->

router.post("/product", (req, res) => {
	const { name, description, amount, photo, owner, category, adquisitionYear } = req.body;
	let averageRating = 0

	Product.create({ name, description, amount, photo, owner, category, adquisitionYear, reviews: [] , averageRating})
	  .then((response) => {
		  User.findByIdAndUpdate(owner, { 
			  $push:{products: response._id}
			/* res.json(response) */
		})
		.then(product => res.json(product))
	})

	  .catch((err) => res.json(err))});
/* }); */

//<------------------RETRIEVES A ESPECIFIC PRODUCT BT ID------------------------------->

router.get("/product/:id", (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
	  res.status(400).json({ message: "Specified id is not valid" });
	  return;
	}
  
	// Each product document has `reviews` array holding `_id`s of Review documents
	// We use .populate() method to get swap the `_id`s for the actual Review documents

	Product.findById(id)
	    .populate('reviews')
	    .then((product) => {
			console.log(product)
			User.findById (product.owner)
				.then ((user)=> {
					res.status(200).json({product: product, user:user})
				})
				.catch ((error)=> { console.log("error: ",error)

				})
	    .catch((error) => {
			res.json(error)}
			);
});
})

//<-----------------ROUTE TO GET PRODUCTS BY CATEGORY-------------------------------------->

router.get("/product/category/:category", (req, res) => {
	let {category} = req.params;

	Product.find ({category: category})
		.then((productsByCategory) => {
			res.json(productsByCategory)
		/* 	console.log("productsByCategory: ", productsByCategory)} */
		//	)
		})
		.catch((err) => res.json(err))
})

//<-----------------ROUTE TO GET PRODUCTS BY SEARCH-------------------------------------->

router.get("/product/search/:searchData", (req, res) => {
	console.log("search: ", req.params)
	let {searchData} = req.params;

	Product.find( { $or:[ {name: { "$regex": `${searchData}`, "$options": "i" }}, {description: { "$regex": `${searchData}`, "$options": "i" }}]} )
		.then((productsBySearchData) => {
			res.json(productsBySearchData)}
			)
		.catch((err) => res.json(err))
})

router.post("/product/filter", (req, res)=> {
	console.log("/product/filter")
	console.log("Req.body :", req.body)
	const {amount, category, averageRating, nameSearch} = req.body
	Product.find({ 
		$and: [
			{amount:{ $lte: amount}}, 
			{category: category}, 			
			{name: { "$regex": `${nameSearch}`, "$options": "i" }},
			{averageRating: {$lte:averageRating}}


		]}
		)
		.sort({"averageRating" : -1 })
		.then((response) => {
			res.json(response)})
	})


//<-----------------ROUTE TO UPDATE A PRODUCT-------------------------------------->

router.put("/product/:productId", (req, res) => {
	const { productId } = req.params;
	console.log("Aquiiiiiiiiiii llega al back", productId)
	const { name, description, amount, photo, category, adquisitionYear } = req.body;


	if (!mongoose.Types.ObjectId.isValid(productId)) {
	  res.status(400).json({ message: "Specified id is not valid" });
	  return;
	}
  
	Product.findByIdAndUpdate(productId, {name, description, amount, photo, category, adquisitionYear }, { new: true })
	  .then((updatedProduct) => {
		  console.log(updatedProduct);
		  res.json(updatedProject)})
	  .catch((error) => res.json(error));
  });

//<-----------------ROUTE TO DELETE A PRODUCT-------------------------------------->

router.delete("/product/:productId", (req, res) => {
	const { productId } = req.params;	

	if (!mongoose.Types.ObjectId.isValid(productId)) {
	  res.status(400).json({ message: "Specified id is not valid" });
	  return;
	}
  
	Product.findByIdAndRemove(productId)
	  .then(() =>
		res.json({
		  message: `Project with ${productId} is removed successfully.`,
		})
	  )
	  .catch((error) => res.json(error));
});


module.exports = router;

