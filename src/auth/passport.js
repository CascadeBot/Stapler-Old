const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;

passport.use(
  new DiscordStrategy(
    {
        clientID: process.env.DISCORD_CLIENTID,
        clientSecret: process.env.DISCORD_CLIENTSECRET,
        callbackURL: process.env.HOST_ORIGIN + "login/cb",
        scope: ['identify', 'email', 'guilds']
    },
    function (accessToken, refreshToken, profile, cb) {
        if (err) return done(err);
        console.log("User:", profile.username, profile.discriminator);
        done({
            username: "123",
            discrimination: "#234"
        });
    }
  )
);

passport.serializeUser((user, done) => {
    done(1);
});

passport.deserializeUser((id, done) => {
    done({
        username: "123",
        discrimination: "#234"
    });
});
