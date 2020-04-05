const express = require("express");
const router = express.Router();
const passport = require("passport");
require("./auth/passport.js");

router.get("/", function (req, res) {
  res.send("Yeetus Deletus");
});

router.get('/login', passport.authenticate('discord'));

router.get(
  "/login/cb",
  passport.authenticate("discord", {
    successRedirect: "/__graphql",
    failureRedirect: "/",
  })
);

module.exports = router;
