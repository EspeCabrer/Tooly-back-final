const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const router = express.Router();
const saltRounds = 10;

router.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body; //<------------REACT CONTROLED FORM INFO STORED----------------->

  if (email === "" || password === "" || username === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      let defaultLocation = {
        lat: "0",
        lng: "0",
      };
      return User.create({
        password: hashedPassword,
        username,
        email,
        location: defaultLocation,
      });
    })
    .then((createdUser) => {
      const { email, name, _id } = createdUser;
      const user = { email, name, _id };
      res.status(200).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post("/google/signup", (req, res) => {
  let defaultLocation = {
    lat: "0",
    lng: "0"
  }
  const { username, password, email } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  User.create({ email, username, password: hashedPassword, location: defaultLocation})
    .then (res.status(200).json({ email: email }))
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
})

router.post("/google", (req, res) => {
  const { username, password, email } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  User.find({ email: email })
    .then((foundUser) => {
    if (!foundUser[0]) {
      User.create({ email, username, password: hashedPassword });
      return;
    }
    const passwordCorrect = bcrypt.compareSync(password, foundUser[0].password);
    if (passwordCorrect) {
      const { _id, username } = foundUser[0];
      const payload = { _id, username };
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });
      res.status(200).json({ authToken: authToken });
    } else {
      res.status(400).json({ message: "Unable to authenticate the user" });
    }
  });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(400).json({ message: "User not found." });
        return;
      }
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
      if (passwordCorrect) {
        const { _id, email } = foundUser;
        const payload = { _id, email };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(400).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});
router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

module.exports = router;
