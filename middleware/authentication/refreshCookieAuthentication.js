const path = require("path");
const fs = require("fs");

const jwt = require("jsonwebtoken");

const { asyncHandler } = require("../handlers/asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");

const publicKey = fs.readFileSync(
  path.resolve(__dirname, "../../keys/refreshTokenKeys/refreshTokenPublic.key"),
  "utf8"
);

exports.refreshCookieAuthentication = asyncHandler(async (req, res, next) => {
  try {
    const refreshCookie = await req.signedCookies["__Secure-datetask-refresh"];
    const refreshToken = jwt.verify(refreshCookie, publicKey);
    if (refreshToken) {
      res.locals.accessDecoder = await refreshToken.refreshToken;
      return next();
    }
    throw new ErrorHandler(401, "refresh token expired");
  } catch (error) {
    console.error(error);
    throw new ErrorHandler(error.status, error.message);
  }
});
