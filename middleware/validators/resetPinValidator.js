const Joi = require("joi");

const { asyncHandler } = require("../handlers/asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");

const AuthenticationModel = require("../../model/dbModels/authenticationModel");

exports.resetPinValidator = asyncHandler(async (req, res, next) => {
  try {
    //   return res.json(res.locals);
    const { email, resetPin } = await res.locals.userCredentials;
    if (
      !(await AuthenticationModel.exists({
        email,
        resetPin,
        isEmailVerified: false,
      }))
    ) {
      throw new ErrorHandler(401, "Unauthorized Access");
    }

    return next();
  } catch (error) {
    throw new ErrorHandler(error.status, error.message);
  }
});
