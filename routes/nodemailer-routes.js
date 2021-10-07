const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer")

router.post('/send-email', (req, res, next) => {
	let { email, subject, message } = req.body;
	let transporter = nodemailer.createTransport({
	  service: 'Gmail',
	  auth: {
		user: process.env.GOOGLE_USERNAME,
		pass: process.env.GOOGLE_PASSWORD,
	  }
	});
	transporter.sendMail({
	  from: '"Tooly" <tooly@gmail.com>',
	  to: email, 
	  subject: subject, 
	  text: message,
	  html: `<b>${message}</b>`
	})
	.then(info => {
		res.json("ok")})
	.catch(error => res.json(error));
  });
  
  module.exports = router