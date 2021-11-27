const bcrypt = require('bcryptjs');

const { asyncHandler } = require('./asyncHandler');
const AuthenticationModel = require('../../model/dbModels/authenticationModel');
const ErrorHandler = require('./errorHandler');

exports.resetPasswordHandler = asyncHandler(async (req, res, next) => {
	const {
		isUserExisting,
		userCredentials: { _id, email, password },
	} = res.locals;

	try {
		if (!isUserExisting) {
			throw new ErrorHandler(
				401,
				'Unauthorized Access or Unable to use existing password'
			);
		}

		const isPasswordUpdated = await AuthenticationModel.findOneAndUpdate(
			{ _id, email },
			{ password: await bcrypt.hash(await password, 10) }
		);

		if (!isPasswordUpdated) {
			throw new ErrorHandler(401, 'Unauthorized Access');
		}

		return next();
	} catch (error) {
		throw new ErrorHandler(error.status, error.message);
	}
});
