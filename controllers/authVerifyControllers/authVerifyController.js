const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../../middleware/handlers/asyncHandler");
const ErrorHandler = require("../../middleware/handlers/errorHandler");

const { accessCookieOptions } = require("../../infosec/cookieOptions");

const { accessTokenHandler } = require("../../infosec/accessTokenHandler");

exports.verifyUserController = asyncHandler(async (req, res) => {
  try {
    const { accessDecoder, renewAccessCookie } = await res.locals;

    if (renewAccessCookie) {
      return await res
        .status(200)
        .cookie(
          "__Secure-datetask-access",
          await accessTokenHandler(accessDecoder),
          accessCookieOptions
        )
        .json({
          code: 200,
          status: true,
          response: "Verified User",
        });
    }
    return await res.status(200).json({
      code: 200,
      status: true,
      response: "Verified User",
    });
  } catch (error) {
    throw new ErrorHandler(401, "Unauthorized Access");
  }
});
