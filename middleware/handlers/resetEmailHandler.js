const bcrypt = require('bcryptjs');

const { asyncHandler } = require('./asyncHandler');
const AuthenticationModel = require('../../model/dbModels/authenticationModel');
const ErrorHandler = require('./errorHandler');
const {
	resetPasswordNodemailer,
} = require('../../utilities/resetPasswordNodemailer');

exports.resetEmailHandler = asyncHandler(async (req, res, next) => {
	const {
		isUserExisting,
		userCredentials: { email },
	} = await res.locals;

	try {
		if (!isUserExisting) {
			return res.status(200).json({
				code: 200,
				status: true,
				response:
					'Instructions to reset your password will be sent to your email',
			});
		}

		await AuthenticationModel.findOneAndUpdate(
			{ email },
			{ isEmailVerified: false }
		);

		const user = await AuthenticationModel.find({ email })
			.limit(1)
			.select( '+resetPins' );
		
		// await resetPasswordNodemailer(email, user[0].resetPins[0]);

		return next();
	} catch (error) {
		throw new ErrorHandler(error.status, error.message);
	}
});
