const express = require("express");
const router = express.Router();

const { authEditRateLimiter } = require("../infosec/rateLimiter");
const { emailValidator } = require("../middleware/validators/emailValidator");
const {
  maliciousUserVerification,
} = require("../middleware/verification/maliciousUserVerification");
const {
  userVerificationByCredentials,
} = require("../middleware/verification/userVerificationByCredentials");
const {
  resetCookieAuthentication,
} = require("../middleware/authentication/resetCookieAuthentication");
const {
  resetPinValidator,
} = require("../middleware/validators/resetPinValidator");

const {
  resetPasswordEmailController,
} = require("../controllers/authResetControlllers/resetPasswordEmailController");

const {
  resetPasswordChangeController,
} = require("../controllers/authResetControlllers/resetPasswordChangeController");

router.use(authEditRateLimiter);

// will receive an email and send new password to email to be changed
router
  .route("/email")
  .post([
    emailValidator,
    maliciousUserVerification,
    userVerificationByCredentials,
    resetPasswordEmailController,
  ]);

router
  .route("/password/:resetPin")
  .get([
    resetCookieAuthentication,
    resetPinValidator,
    resetPasswordChangeController,
  ]);

module.exports = router;
