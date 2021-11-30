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

    // res.cookie(name, value [, options])

    const rc = {
      name: "authentication-refresh",
      value: refreshTokenHandler(user[0]),
      options: {
        signed: true,
        // expires in 28 days
        expires: new Date(Date.now() + 6048000 * 4),
        maxAge: new Date(Date.now() + 6048000 * 4),
        // make secure true upon deployment
        secure: false,
        httpOnly: false,
        sameSite: true,
      },
    };

    const ac = {
      name: "authentication-access",
      value: accessTokenHandler(user[0]),
      options: {
        signed: true,
        // 30 min expiration
        expires: 1800000,
        maxAge: 1800000,
        // make secure true upon deployment
        secure: false,
        httpOnly: false,
        sameSite: true,
      },
    };

    return await res
      .status(200)
      .cookie({...rc})
      .cookie({...ac})
      .json({
        code: 200,
        status: true,
        message: "Successfully logged in",
      });
    // return await res
    //   .status(200)
    //   .cookie(
    //     "authentication-refresh",
    //     await refreshTokenHandler(await user[0]),
    //     refreshCookieOptions
    //   )
    //   .cookie(
    //     "authentication-access",
    //     await accessTokenHandler(await user[0]._id),
    //     accessCookieOptions
    //   )
    //   .json({
    //     code: 200,
    //     status: true,
    //     message: "Successfully logged in",
    //   });
  } catch (error) {
    throw new ErrorHandler(error.status, error.message);
  }
});
