const nodemailer = require('nodemailer');

exports.resetPasswordNodemailer = async (email) => {
	var transporter = nodemailer.createTransport({
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
	});

	var mailOptions = {
		from: process.env.RESET_EMAIL,
		to: email,
		subject: 'Password Reset Instructions',
		text: `you have successfully reset your password`,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		//maybe this should be error logged as well
		if (error) {
			console.log(error);
		} else {
			// log this to the reset email db thing
			console.log('Email sent: ' + info.response);
		}
	});
};
