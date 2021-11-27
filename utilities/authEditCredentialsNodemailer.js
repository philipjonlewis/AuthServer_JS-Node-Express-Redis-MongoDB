const nodemailer = require('nodemailer');
const { asyncHandler } = require('../middleware/handlers/asyncHandler');
const AuthenticationModel = require('../model/dbModels/authenticationModel');
const ErrorHandler = require('../middleware/handlers/errorHandler');

//Add some conditional regarding which type of role the user has

exports.authEditCredentialsNodemailer = asyncHandler(
	async ({ _id, modifiedCredential }) => {
		try {
			const user = await AuthenticationModel.find({ _id })
				.limit(1)
				.select('+username +email');

			const transporter = nodemailer.createTransport({
				service: 'gmail',
				secure: false,
				port: 25,
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
				to: user[0].email,
				subject: 'You have edited your profile',
				text: `Hello ${user[0].username} , you have successfully edited your ${modifiedCredential}
			
			not you? click this link or contact us soon`,
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					throw new ErrorHandler(400, error.message);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});
		} catch (error) {
			throw new ErrorHandler(error.status, error.message);
		}
	}
);
