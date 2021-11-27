const { v4: uuidv4 } = require("uuid");

const { asyncHandler } = require("../../middleware/handlers/asyncHandler");
const ErrorHandler = require("../../middleware/handlers/errorHandler");
const AuthenticationModel = require("../../model/dbModels/authenticationModel");

exports.verifyEmailController = asyncHandler(async (req, res) => {
  // This controller must distinguish if email verification is for sign up or changes in the users credentials
  try {
    const { accessDecoder } = await res.locals;
    const emailPin = await req.params.emailPin;

    if (
      await AuthenticationModel.exists({
        _id: accessDecoder,
        emailVerificationPin: emailPin,
        isEmailVerified: false,
      })
    ) {
      await AuthenticationModel.findOneAndUpdate(
        { _id: accessDecoder, emailVerificationPin: emailPin },
        { isEmailVerified: true, emailVerificationPin: uuidv4() }
      );
      return await res.status(200).json({
        code: 200,
        status: true,
        response: "Verified User",
      });
    }

    return await res.status(200).json({
      code: 200,
      status: true,
      response: "User already verified",
    });
  } catch (error) {
    throw new ErrorHandler(error.status, error.message);
  }
});
