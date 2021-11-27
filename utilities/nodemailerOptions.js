const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
	service: 'gmail',
	secure: false, // use SSL
	port: 25, // port for secure SMTP
	auth: {
		user: process.env.RESET_EMAIL,
		pass: process.env.RESET_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false,
	},
} );



