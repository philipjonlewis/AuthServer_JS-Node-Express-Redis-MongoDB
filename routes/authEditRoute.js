const express = require("express");
const router = express.Router();

const { authEditRateLimiter } = require("../infosec/rateLimiter");

const {
  refreshCookieAuthentication,
} = require("../middleware/authentication/refreshCookieAuthentication");
const {
  accessCookieAuthentication,
} = require("../middleware/authentication/accessCookieAuthentication");

const {
  editEmailValidator,
} = require("../middleware/validators/editEmailValidator");
const {
  editUsernameValidator,
} = require("../middleware/validators/editUsernameValidator");
const {
  editPasswordValidator,
} = require("../middleware/validators/editPasswordValidator");

const {
  userVerificationById,
} = require("../middleware/verification/userVerificationById");

const {
  editEmailController,
} = require("../controllers/authEditControllers/editEmailController");
const {
  editUsernameController,
} = require("../controllers/authEditControllers/editUsernameController");
const {
  editPasswordController,
} = require("../controllers/authEditControllers/editPasswordController");
const {
  maliciousUserVerification,
} = require("../middleware/verification/maliciousUserVerification");

router.use(authEditRateLimiter);

router
  .route("/email")
  .patch([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    editEmailValidator,
    maliciousUserVerification,
    userVerificationById,
    editEmailController,
  ]);

router
  .route("/username")
  .patch([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    editUsernameValidator,
    maliciousUserVerification,
    userVerificationById,
    editUsernameController,
  ]);

router
  .route("/password")
  .patch([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    editPasswordValidator,
    userVerificationById,
    editPasswordController,
  ]);

module.exports = router;
