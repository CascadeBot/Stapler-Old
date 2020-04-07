const express = require("express");
const router = express.Router();
const passport = require("passport");
const { login: loginConfig } = require("../helpers/config");

router.get('/login', passport.authenticate('discord'));
router.get(
  "/login/cb",
  passport.authenticate("discord", {
    failureRedirect: loginConfig.redirects.failure,
  }), (req, res) => {
    res.redirect(loginConfig.redirects.success);
  }
);

module.exports = router;
