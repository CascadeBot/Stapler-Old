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
    function (accessToken, refreshToken, profile, done) {
        console.log("User:", profile.username, profile.discriminator);
        done(null, {
            username: "123",
            discrimination: "#234"
        });
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, "1");
});

passport.deserializeUser((id, done) => {
    done(null, {
        username: "123",
        discrimination: "#234"
    });
});
