const jwt = require("jsonwebtoken");

const { asyncHandler } = require("../handlers/asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");

exports.accessCookieAuthentication = asyncHandler(async (req, res, next) => {
  try {
    const accessCookie = await req.signedCookies["authentication-access"];

    jwt.verify(accessCookie, res.locals.accessDecoder, (err, decoded) => {
      if (decoded) {
        res.locals.renewAccessCookie = false;
        return next();
      }
      if (err.name == "TokenExpiredError") {
        res.locals.renewAccessCookie = true;

        return next();
      }
      if (err) {
        throw new ErrorHandler(
          401,
          "access token expired, please log in again"
        );
      }
    });
  } catch (error) {
    throw new ErrorHandler(error.status, error.message);
  }
});
