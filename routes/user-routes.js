const express = require("express");
const router = express.Router();
const User = require("../models/User.model")
const mongoose = require("mongoose")

//<-----------------ROUTE TO GET ALL USERS -------------------------------------------------------------------------------------------------------->

router.get("/user", (req, res) => {
    User.find()
    .then(userArray=>res.json(userArray))
    .catch(err => console.log(err))
})

//<-----------------ROUTE TO GET USER BY ID -------------------------------------------------------------------------------------------------------->

router.get( "/user/:id" , (req, res) =>{

    const {id} = req.params  
    User.findById(id)
    .populate ("products")
    .populate ("rentals")
    .populate ("favorites")
    .then(user => res.json(user))
    .catch(err => console.log(err))
})

//<-----------------ROUTE TO GET USER BY EMAIL -------------------------------------------------------------------------------------------------------->

router.post( "/user/email" , (req, res) =>{
    const {email} = req.body  
    User.find({email: email})
    .then(user => {
        if (user.length>0) {
            res.json("1")
        }else{ 
            res.json("0")
        }
    })
    .catch(err => console.log(err))
})

//<-----------------ROUTE TO UPDATE USERS-------------------------------------------------------------------------------------------------------->

router.put( "/user/:id", (req,res) =>{

    const {id} = req.params  
    const {fullName, username, address, profileImg, location } = req.body  
    
    address && location ?

    User.findByIdAndUpdate(id, {address, location}, {new:true})
    .then(userUpdated => {
        res.json(userUpdated)
     })
    .catch(err => console.log("put error back", err))
        
    :

    User.findByIdAndUpdate(id, {fullName, username, profileImg }, {new:true})
    .then(userUpdated => {
        res.json(userUpdated)
        console.log("userupdatedback" , userUpdated) })
    .catch(err => console.log("put error back", err))
    
})


//<-----------------ROUTE TO UPDATE USERS-------------------------------------------------------------------------------------------------------->

router.delete("/user/:id", (req, res) =>{

    const {id} = req.params  

    User.findByIdAndDelete(id)
    .then(userDeleted => console.log(userDeleted))
    .catch(err => console.log(err))
})

//<-----------------ROUTE TO ADD FAVORITES TO USERS-------------------------------------------------------------------------------------------------------->

router.post("/fav/:id", (req,res) => {
    const {id} = req.params
    const {userId} = req.body
    User.findById(userId)
      .then((result)=>{
          
          if(!result.favorites.includes(id)){
            User.findByIdAndUpdate(userId,{
                $push:{favorites: id}
            })
            .then((result)=>console.log('add to favorites:',result))
          } else { console.log('Already have this one')}
      })
    .then(result=>console.log('result:',result))
})

//<-----------------ROUTE TO CHECK FAVORITES-------------------------------------------------------------------------------------------------------->

router.put("/fav/:id", (req,res) => {
    const {id} = req.params
    const {userId} = req.body
    let favoriteArray =[]
    console.log('user id:', userId)
    console.log('req:', req.body)

    User.findById(userId)
    .then((result)=>{
       let favoriteArray = result.data.favorites
    })
    let filteredArray = favoriteArray.filter((favorite)=>{favorite !== id})

    User.findByIdAndUpdate(userId,{ favorites:filteredArray})
    .then((result)=>{
        console.log('remove from favorites:',result)
     })
    
})


module.exports = router