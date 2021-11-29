const { asyncHandler } = require("../handlers/asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");
const ErrorLogModel = require("../../model/dbModels/errorLogModel");
const MaliciousUserModel = require("../../model/dbModels/maliciousUserModel");

exports.maliciousUserVerification = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, isEmail, newUsername } =
      res.locals.userCredentials;

    if (
      await MaliciousUserModel.exists({
        ...(isEmail ? { email } : { username } || { username: newUsername }),
      })
    ) {
      return await res
        .status(200)
        .clearCookie("__Secure-datetask-refresh", { path: "/" })
        .clearCookie("__Secure-datetask-access", { path: "/" })
        .clearCookie("__Secure-datetask-reset", { path: "/" })
        .header("Authorization", `Bearer `)
        .json({
          code: 401,
          status: true,
          response:
            "User with those credentials have been permanently blocked from this website",
        });
    }
    return next();
  } catch (error) {
    throw new ErrorHandler(error.status, error.message);
  }
});
