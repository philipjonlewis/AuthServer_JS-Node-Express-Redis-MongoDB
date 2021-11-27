const bcrypt = require("bcryptjs");
const RandExp = require("randexp");

const { asyncHandler } = require("../../middleware/handlers/asyncHandler");
const AuthenticationModel = require("../../model/dbModels/authenticationModel");
const ErrorHandler = require("../../middleware/handlers/errorHandler");

const {
  resetCredentialsHandler,
} = require("../../middleware/handlers/resetCredentialsHandler");
const {
  unverifiedEmailHandler,
} = require("../../middleware/handlers/unverifiedEmailHandler");
const {
  existingCredentialsHandler,
} = require("../../middleware/handlers/existingCredentialsHandler");

const {
  authEditCredentialsNodemailer,
} = require("../../utilities/authEditCredentialsNodemailer");

const { resetTokenHandler } = require("../../infosec/resetTokenHandler");

const { resetCookieOptions } = require("../../infosec/cookieOptions");

exports.resetPasswordEmailController = asyncHandler(async (req, res, next) => {
  try {
    const { isUserExisting, userCredentials } = await res.locals;

    if (!isUserExisting) {
      throw new ErrorHandler(401, "Unauthorized Access");
    }

    const resetPin = await AuthenticationModel.find({
      email: userCredentials.email,
    })
      .limit(1)
      .select("-createdAt -updatedAt -__v +emailVerificationPin");

    // find user via email address and send a link containing the users reset pin

    //this nodemailer must send an email for changes verification
    // authEditCredentialsNodemailer({
    //   _id: await res.locals.accessDecoder,
    //   modifiedCredential: "username",
    // });

    return await res
      .status(200)
      .clearCookie("__Secure-datetask-refresh", { path: "/" })
      .clearCookie("__Secure-datetask-access", { path: "/" })
      .clearCookie("__Secure-datetask-reset", { path: "/" })
      .header("Authorization", `Bearer `)
      .cookie(
        "__Secure-datetask-reset",
        await resetTokenHandler(
          await userCredentials.email,
          await resetPin[0].emailVerificationPin
        ),
        resetCookieOptions
      )
      .json({
        code: 200,
        status: true,
        response: "Please check your email for further instructions",
      });
  } catch (error) {
    throw new ErrorHandler(error.status, error.message);
  }
});
