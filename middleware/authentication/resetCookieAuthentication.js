const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const AuthenticationModel = require("../../model/dbModels/authenticationModel");

const { asyncHandler } = require("../handlers/asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");

const publicKey = fs.readFileSync(
  path.resolve(
    __dirname,
    "../../keys/resetPasswordPinKeys/resetPasswordPinPublic.key"
  ),
  "utf8"
);

exports.resetCookieAuthentication = asyncHandler(async (req, res, next) => {
  try {
    const resetCookie = await req.signedCookies["__Secure-datetask-reset"];

    const resetToken = jwt.verify(await resetCookie, await req.params.resetPin);

    const userCredentials = {
      email: await resetToken.resetToken,
      resetPin: await req.params.resetPin,
    };

    res.locals.userCredentials = await userCredentials;
    return next();
  } catch (error) {
    console.log(error);
    throw new ErrorHandler(error.status, error.message);
  }
});
