const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer")
//require("../templates/template")

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
	  //html: templates.templateExample(message)
	})
/* 	console.log("EMAIL SENT") */
	.then(info => {
		console.log ('MESSAGE SENT', {email, subject, message, info})
		res.json("ok")})
	.catch(error => console.log(error));
  });
  
  
  module.exports = router