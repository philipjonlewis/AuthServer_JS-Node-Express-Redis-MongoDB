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

exports.resetPasswordChangeController = asyncHandler(async (req, res, next) => {
  try {
    const { email, resetPin } = await res.locals.userCredentials;

    // this is still an issue
    const newPassword = new RandExp(
      /(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,32}$/
    ).gen();

    console.log(newPassword);

    await AuthenticationModel.findOneAndUpdate(
      { email },
      {
        password: await bcrypt.hash(
          process.env.PASSWORD_HASH,
          process.env.HASH_VALUE
        ),
        isEmailVerified: true,
      }
    );

    //this nodemailer must send an email for changes verification
    // authEditCredentialsNodemailer({
    //   _id: await res.locals.accessDecoder,
    //   modifiedCredential: "username",
    // });

    await resetCredentialsHandler(res);
  } catch (error) {
    throw new ErrorHandler(error.status, error.message);
  }
});
