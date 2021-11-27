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

exports.editUsernameController = asyncHandler(async (req, res, next) => {
  try {
    const {
      accessDecoder,
      isUserExisting,
      userCredentials: { password, newUsername },
    } = await res.locals;

    if (!isUserExisting) {
      throw new ErrorHandler(401, "Unauthorized Access");
    }

    if (
      await AuthenticationModel.exists({
        username: newUsername,
      })
    ) {
      throw new ErrorHandler(401, "Username unavailable");
    }

    const user = await AuthenticationModel.find({
      _id: accessDecoder,
    })
      .limit(1)
      .select(" +username +password +isEmailVerified");

    if (!(await bcrypt.compare(password, user[0].password))) {
      throw new ErrorHandler(401, "Unauthorized Access");
    }

    if (user[0].username === newUsername) {
      await existingCredentialsHandler(res, "username");
    }

    if (!user[0].isEmailVerified) {
      await unverifiedEmailHandler(res);
    }

    await AuthenticationModel.findOneAndUpdate(
      { _id: accessDecoder },
      { username: await newUsername, isEmailVerified: false }
    );

    //this nodemailer must send an email for changes verification
    // authEditCredentialsNodemailer({
    //   _id: await res.locals.accessDecoder,
    //   modifiedCredential: "username",
    // });

    await resetCredentialsHandler(res);

    return next();
  } catch (error) {
    throw new ErrorHandler(error.status, error.message);
  }
});
