const bcrypt = require("bcryptjs");

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

exports.editPasswordController = asyncHandler(async (req, res, next) => {
  try {
    const {
      accessDecoder,
      isUserExisting,
      userCredentials: { newPassword, existingPassword },
    } = await res.locals;

    if (!isUserExisting) {
      throw new ErrorHandler(401, "Unauthorized Access");
    }

    const user = await AuthenticationModel.find({
      _id: accessDecoder,
    })
      .select(" +password +isEmailVerified")
      .limit(1);

    if (!(await bcrypt.compare(existingPassword, user[0].password))) {
      throw new ErrorHandler(401, "Unauthorized Access");
    }

    if (await bcrypt.compare(newPassword, user[0].password)) {
      await existingCredentialsHandler(res, "password");
    }

    if (!user[0].isEmailVerified) {
      await unverifiedEmailHandler(res);
    }

    await AuthenticationModel.findOneAndUpdate(
      { _id: accessDecoder },
      {
        password: await bcrypt.hash(await newPassword, process.env.HASH_VALUE),
        isEmailVerified: false,
      }
    );

    //this nodemailer must send an email for changes verification
    // authEditCredentialsNodemailer({
    //   _id: await res.locals.accessDecoder,
    //   modifiedCredential: "password",
    // });

    await resetCredentialsHandler(res);
  } catch (error) {
    throw new ErrorHandler(error.status, error.message);
  }
});
