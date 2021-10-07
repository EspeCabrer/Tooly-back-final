const express = require("express");
const router = express.Router();
const User = require("../models/User.model")
const mongoose = require("mongoose")

//<-----------------ROUTE TO GET ALL USERS -------------------------------------------------------------------------------------------------------->

router.get("/user", (req, res) => {
  User.find()
    .then((userArray) => res.json(userArray))
    .catch((err) => res.json(err));
});

//<-----------------ROUTE TO GET USER BY ID -------------------------------------------------------------------------------------------------------->

router.get("/user/:id", (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .populate("products")
    .populate("rentals")
    .populate("favorites")
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

//<-----------------ROUTE TO GET USER BY EMAIL -------------------------------------------------------------------------------------------------------->

router.post("/user/email", (req, res) => {
  const { email } = req.body;
  User.find({ email: email })
    .then((user) => {
      if (user.length > 0) {
        res.json("1");
      } else {
        res.json("0");
      }
    })
    .catch((err) => res.json(err));
});

//<-----------------ROUTE TO UPDATE USERS-------------------------------------------------------------------------------------------------------->

router.put("/user/:id", (req, res) => {
  const { id } = req.params;
  const { fullName, username, address, profileImg, location } = req.body;

  if (address && location) {
    User.findByIdAndUpdate(id, { address, location }, { new: true })
      .then((userUpdated) => {
        Product.updateMany({ owner: userUpdated._id }, { location: location })
          .then(() => res.json(userUpdated))
          .catch((err) => res.json(err));
        return res.json(userUpdated);
      })
      .catch((err) => res.json(err));
  } else {
    User.findByIdAndUpdate(
      id,
      { fullName, username, profileImg },
      { new: true }
    )
      .then((userUpdated) => {
        res.json(userUpdated);
      })
      .catch((err) => res.json(err));
  }
});

//<-----------------ROUTE TO UPDATE USERS-------------------------------------------------------------------------------------------------------->

router.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id)
    .then((userDeleted) => res.json(userDeleted))
    .catch((err) => res.json(err));
});

//<-----------------ROUTE TO ADD FAVORITES TO USERS-------------------------------------------------------------------------------------------------------->

router.post("/fav/:id", (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  User.findById(userId)
    .then((result) => {
      if (!result.favorites.includes(id)) {
        User.findByIdAndUpdate(userId, {
          $push: { favorites: id },
        }).then((result) => res.json(result));
      } else {
        res.json("Already have this one");
      }
    })
    .then((result) => res.json(result));
});

//<-----------------ROUTE TO CHECK FAVORITES-------------------------------------------------------------------------------------------------------->

router.put("/fav/:id", (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  let favoriteArray = [];
  User.findById(userId).then((result) => {
    let favoriteArray = result.data.favorites;
  });
  let filteredArray = favoriteArray.filter((favorite) => {
    favorite !== id;
  });

  User.findByIdAndUpdate(userId, { favorites: filteredArray }).then(
    (result) => {
      res.json(result);
    }
  );
});


module.exports = router