const bcrypt = require("bcryptjs");

const { asyncHandler } = require("../../middleware/handlers/asyncHandler");
const ErrorHandler = require("../../middleware/handlers/errorHandler");
const AuthenticationModel = require("../../model/dbModels/authenticationModel");
const { accessTokenHandler } = require("../../infosec/accessTokenHandler");
const {
  refreshCookieOptions,
  accessCookieOptions,
} = require("../../infosec/cookieOptions");
const { refreshTokenHandler } = require("../../infosec/refreshTokenHandler");

exports.logInController = asyncHandler(async (req, res, next) => {
  try {
    if (!res.locals.isUserExisting) {
      throw new ErrorHandler(404, "Unable to log in with given credentials");
    }

    const { username, password, email, isEmail } = await res.locals
      .userCredentials;

    const user = await AuthenticationModel.find({
      ...(isEmail ? { email } : { username }),
    })
      .select("+email +password +_id -createdAt -updatedAt -__v")
      .limit(1);

    if (!(await bcrypt.compare(password, user[0].password))) {
      throw new ErrorHandler(404, "Unable to log in with given credentials");
    }

    return await res
      .status(200)
      .cookie(
        "__Secure-datetask-refresh",
        await refreshTokenHandler(await user[0]),
        refreshCookieOptions
      )
      .cookie(
        "__Secure-datetask-access",
        await accessTokenHandler(await user[0]._id),
        accessCookieOptions
      )
      .json({
        code: 200,
        status: true,
        message: "Successfully logged in",
      });
  } catch (error) {
    throw new ErrorHandler(error.status, error.message);
  }
});
