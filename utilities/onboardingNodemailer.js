const nodemailer = require('nodemailer');

//Add some conditional regarding which type of role the user has
exports.onboardingNodemailer = async (user) => {
	const transporter = nodemailer.createTransport({
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

	const mailOptions = {
		from: process.env.RESET_EMAIL,
		to: user.email,
		subject: 'Welcome to datetask!',
		text: `Thank you for choosing datetask! please click this link to verify your email http://127.0.0.1:5000/authentication/user/verify/email/${user.emailVerificationPin}`,
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
