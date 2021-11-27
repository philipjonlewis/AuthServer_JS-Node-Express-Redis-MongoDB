const AuthenticationModel = require("../../model/dbModels/authenticationModel");
const { asyncHandler } = require("../handlers/asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");

// this should check using the refresh cookie access decoder and not user input --not sure about this previous comment.  This code could just stay as a db verification

exports.userVerificationByCredentials = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, isEmail } = res.locals.userCredentials;
    (await AuthenticationModel.exists({
      ...(isEmail ? { email } : { username }),
    }))
      ? (res.locals.isUserExisting = true)
      : (res.locals.isUserExisting = false);
    return next();
  } catch (error) {
    throw new ErrorHandler(500, error.message);
  }
});
