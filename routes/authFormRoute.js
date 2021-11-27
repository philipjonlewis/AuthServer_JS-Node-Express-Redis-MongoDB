const express = require("express");
const { asyncHandler } = require("../middleware/handlers/asyncHandler");
const router = express.Router();



//CSRF Beauty
//Must also have its own rate limiter

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

router.route("/reset/password").get(
  asyncHandler((req, res) => {
    res.render("pages/authentication/resetPassword", {
      csrfToken: req.csrfToken(),
    });
  })
);

router.route("/edit/username").get(
  asyncHandler((req, res) => {
    res.render("pages/authentication/editUsername", {
      csrfToken: req.csrfToken(),
    });
  })
);

router.route("/edit/password").get(
  asyncHandler((req, res) => {
    res.render("pages/authentication/editPassword", {
      csrfToken: req.csrfToken(),
    });
  })
);

router.route("/edit/email").get(
  asyncHandler((req, res) => {
    res.render("pages/authentication/editEmail", {
      csrfToken: req.csrfToken(),
    });
  })
);

module.exports = router;
