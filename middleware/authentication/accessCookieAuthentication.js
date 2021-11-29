const jwt = require("jsonwebtoken");

const { asyncHandler } = require("../handlers/asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");

exports.accessCookieAuthentication = asyncHandler(async (req, res, next) => {
  try {
    const accessCookie = await req.signedCookies["__Secure-datetask-access"];

    jwt.verify(accessCookie, res.locals.accessDecoder, (err, decoded) => {
      if (decoded) {
        res.locals.renewAccessCookie = false;
        return next();
      }
      if (err.name == "TokenExpiredError") {
        res.locals.renewAccessCookie = true;
        return next();
      }
      console.log(err);
      if (err) {
        throw new ErrorHandler(401, "access token expired");
      }
    });
    
  } catch (error) {
    throw new ErrorHandler(error.status, error.message);
  }
});
