const express = require("express");
const router = express.Router();

const { authFormRateLimiter } = require("../infosec/rateLimiter");

const {
  accessCookieAuthentication,
} = require("../middleware/authentication/accessCookieAuthentication");
const {
  refreshCookieAuthentication,
} = require("../middleware/authentication/refreshCookieAuthentication");
const { asyncHandler } = require("../middleware/handlers/asyncHandler");


// router.use(authFormRateLimiter);

router.route("/signup").get(
  asyncHandler((req, res) => {
    res.render("pages/authentication/signup", {
      csrfToken: req.csrfToken(),
      firstName: "philip",
    });
  })
);

router.route("/login").get(
  asyncHandler((req, res) => {
    res.render("pages/authentication/login", { csrfToken: req.csrfToken() });
  })
);

//TODO routes below must also be protected by refresh, acess, etc

router.route("/forgotpassword").get(
  asyncHandler((req, res) => {
    res.render("pages/authentication/forgotPassword", {
      csrfToken: req.csrfToken(),
    });
  })
);

router.route("/edit/username").get(
  refreshCookieAuthentication,
  accessCookieAuthentication,
  //! Must send a edit credential cookie
  asyncHandler((req, res) => {
    res.render("pages/authentication/editUsername", {
      csrfToken: req.csrfToken(),
    });
  })
);

router.route("/edit/password").get(
  refreshCookieAuthentication,
  accessCookieAuthentication,
  //! Must send a edit credential cookie
  asyncHandler((req, res) => {
    res.render("pages/authentication/editPassword", {
      csrfToken: req.csrfToken(),
    });
  })
);

router.route("/edit/email").get(
  refreshCookieAuthentication,
  accessCookieAuthentication,
  //! Must send a edit credential cookie
  asyncHandler((req, res) => {
    res.render("pages/authentication/editEmail", {
      csrfToken: req.csrfToken(),
    });
  })
);

module.exports = router;
