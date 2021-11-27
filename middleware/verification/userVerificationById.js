const AuthenticationModel = require("../../model/dbModels/authenticationModel");
const { asyncHandler } = require("../handlers/asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");

// this should check using the refresh cookie access decoder and not user input data
exports.userVerificationById = asyncHandler(async (req, res, next) => {
  try {
    (await AuthenticationModel.exists({ _id: await res.locals.accessDecoder }))
      ? (res.locals.isUserExisting = true)
      : (res.locals.isUserExisting = false);
    return next();
  } catch (error) {
    throw new ErrorHandler(500, error.message);
  }
});
