const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const router = express.Router();
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  console.log("Req body  signup:", req.body);

  const { username, password, email } = req.body; //<------------REACT CONTROLED FORM INFO STORED----------------->

  /*   console.log("req.body:    ", req.body)
    console.log("signup") */
  // Check if email or password or name are provided as empty string
  if (email === "" || password === "" || username === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // Use regex to validate the password format
  /*   const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({ message: 'Password must have at least 4 characters and contain at least one number, one lowercase and one uppercase letter.' });
      return;
    } */

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      console.log("password: hashedPassword, username, email--->", { password: hashedPassword, username, email })
      return User.create({ password: hashedPassword, username, email });
    })
    .then((createdUser) => {
      console.log("CREATEDUSER: ", createdUser);
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, name, _id } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, _id };

      // Send a json response containing the user object
      res.status(200).json({ user: user });
    })

    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post("/google/signup", (req, res) => {
  const { username, password, email } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  console.log("USER NOT FOUND");
  User.create({ email, username, password: hashedPassword })
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
      console.log("USER NOT FOUND");
      // If the user is not found, send an error response
      User.create({ email, username, password: hashedPassword });
      return;
    }
    console.log("USER FOUND");
    // Compare the provided password with the one saved in the database
    const passwordCorrect = bcrypt.compareSync(password, foundUser[0].password);
    if (passwordCorrect) {
      console.log("PASSWORD CORRECT");
      // Deconstruct the user object to omit the password
      const { _id, username } = foundUser[0];
      // Create an object that will be set as the token payload
      const payload = { _id, username };
      // Create and sign the token
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });
      // Send the token as the response
      res.status(200).json({ authToken: authToken });
    } else {
      res.status(400).json({ message: "Unable to authenticate the user" });
    }
  });
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
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
