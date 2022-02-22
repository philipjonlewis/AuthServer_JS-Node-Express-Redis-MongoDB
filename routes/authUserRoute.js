const express = require("express");
const router = express.Router();

const { authRateLimiterMiddleware } = require("../infosec/rateLimiter");

const { signUpValidator } = require("../middleware/validators/signUpValidator");
const { logInValidator } = require("../middleware/validators/logInValidator");
const {
  maliciousUserVerification,
} = require("../middleware/verification/maliciousUserVerification");
const {
  userVerificationByCredentials,
} = require("../middleware/verification/userVerificationByCredentials");

const {
  signUpController,
} = require("../controllers/authUserControllers/authSignupController");
const {
  logInController,
} = require("../controllers/authUserControllers/authLogInController");
const {
  logOutController,
} = require("../controllers/authUserControllers/authLogOutController");

// router.use(authRateLimiterMiddleware);

router
  .route("/signup")
  .post([
    signUpValidator,
    maliciousUserVerification,
    userVerificationByCredentials,
    signUpController,
  ]);

router
  .route("/login")
  .post([
    logInValidator,
    maliciousUserVerification,
    userVerificationByCredentials,
    logInController,
  ]);

router.route("/logout").get(logOutController);

module.exports = router;

//http://localhost:5000/authentication/form/login
