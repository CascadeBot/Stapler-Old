const { getDB } = require("../setup/db");
const DiscordStrategy = require("passport-discord").Strategy;

const discordStrategy = new DiscordStrategy(
    {
        clientID: process.env.DISCORD_CLIENTID,
        clientSecret: process.env.DISCORD_CLIENTSECRET,
        callbackURL: process.env.HOST_ORIGIN + "login/cb",
        scope: ['identify', 'email', 'guilds']
    },
    function (accessToken, refreshToken, profile, done) {
        getDB().users.findOneAndUpdate(
            { _id: profile.id },
            {
                $setOnInsert: {
                    username: profile.username,
                    discriminator: profile.discriminator,
                    avatar: profile.avatar,
                    email: profile.email,
                    accessToken, // temp, maybe encrypt the tokens?
                    refreshToken,
                }
            },
            {
                new: true,
                upsert: true,
                returnOriginal: false
            },
            (err, res) => {
                if (err) return done(err);
                done(null, res.value);
            }
        );
    }
);

function discordSerialize(user, done) {
    done(null, user._id);
}

function discordDeserialize(id, done) {
    getDB().users.findOne(
        { _id: id },
        (err, res) => {
            if (err) return done(err);
            done(null, res);
        }
    );
}

module.exports = {
    discordStrategy,
    discordSerialize,
    discordDeserialize
}
