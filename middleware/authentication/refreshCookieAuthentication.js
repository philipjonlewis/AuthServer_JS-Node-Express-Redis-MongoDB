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
    const refreshCookie = req.signedCookies["authentication-refresh"];

    jwt.verify(refreshCookie, publicKey, (err, decoded) => {
      if (decoded) {
        res.locals.accessDecoder = decoded.refreshToken;
        return next();
      }

      throw new ErrorHandler(401, "refresh token expired, Please log in again");
    });
  } catch (error) {
    throw new ErrorHandler(error.status, error.message);
  }
});
