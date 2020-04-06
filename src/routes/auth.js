const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get('/login', passport.authenticate('discord'));
router.get(
  "/login/cb",
  passport.authenticate("discord", {
    failureRedirect: process.env.LOGIN_FAILURE_REDIRECT,
  }), (req, res) => {
    res.redirect(process.env.LOGIN_SUCCESS_REDIRECT);
  }
);

module.exports = router;
