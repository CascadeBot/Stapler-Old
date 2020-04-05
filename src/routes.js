const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", function (req, res) {
  res.send("Yeetus Deletus");
});

router.get('/login', passport.authenticate('discord'));
router.get(
  "/login/cb",
  passport.authenticate("discord", {
    failureRedirect: "/",
  }), (req, res) => {
    res.redirect("/me");
  }
);

router.get("/me", (req, res) => {
    res.json(req.user);
});

module.exports = router;
