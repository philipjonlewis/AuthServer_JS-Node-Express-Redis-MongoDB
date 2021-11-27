const { v4: uuidv4 } = require("uuid");

const { asyncHandler } = require("../../middleware/handlers/asyncHandler");
const ErrorHandler = require("../../middleware/handlers/errorHandler");
const AuthenticationModel = require("../../model/dbModels/authenticationModel");
const { accessTokenHandler } = require("../../infosec/accessTokenHandler");
const {
  refreshCookieOptions,
  accessCookieOptions,
} = require("../../infosec/cookieOptions");

const {
  onboardingNodemailer,
} = require("../../utilities/onboardingNodemailer");

exports.signUpController = asyncHandler(async (req, res, next) => {
  try {
    if (res.locals.isUserExisting) {
      throw new ErrorHandler(409, "Unable to process credentials");
    }

    const user = await AuthenticationModel.create({
      ...(await res.locals.userCredentials),
      _id: uuidv4(),
    });

    // await onboardingNodemailer(await user);
    console.timeEnd("signup");
    return await res
      .status(201)
      .cookie(
        "__Secure-datetask",
        user.refreshTokens[user.refreshTokens.length - 1],
        refreshCookieOptions
      )
      .cookie(
        "__Secure-datetask-access",
        await accessTokenHandler(await user._id),
        accessCookieOptions
      )
      .json({
        code: 201,
        status: true,
        message: "Successfully created a new user",
      });
  } catch (error) {
    throw new ErrorHandler(error.status, error.message);
  }
});
