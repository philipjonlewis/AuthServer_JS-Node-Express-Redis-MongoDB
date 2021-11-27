const express = require("express");
const router = express.Router();

const { asyncHandler } = require("../middleware/handlers/asyncHandler");
const ErrorHandler = require("../middleware/handlers/errorHandler");

const {
  refreshCookieOptions,
  accessCookieOptions,
} = require("../infosec/cookieOptions");

const {
  refreshCookieAuthentication,
} = require("../middleware/authentication/refreshCookieAuthentication");
const {
  accessCookieAuthentication,
} = require("../middleware/authentication/accessCookieAuthentication");

const {
  verifyUserController,
} = require("../controllers/authVerifyControllers/authVerifyController");

const {
  verifyEmailController,
} = require("../controllers/authVerifyControllers/authVerifyEmailController");

// This route verifies logged in user without exposing user data
router
  .route("/")
  .get([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    verifyUserController,
  ]);

router
  .route("/email/:emailPin")
  .get([
    refreshCookieAuthentication,
    accessCookieAuthentication,
    verifyEmailController,
  ]);

module.exports = router;
