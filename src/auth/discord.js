const { getDB } = require("../setup/db");
const { discord: discordConfig, login: loginConfig } = require("../helpers/config");
const DiscordStrategy = require("passport-discord").Strategy;

const discordStrategy = new DiscordStrategy(
    {
        clientID: discordConfig.client_id,
        clientSecret: discordConfig.client_secret,
        callbackURL: loginConfig.host_origin + "/auth/login/cb",
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
                    accessToken, // temp, maybe encrypt the tokens? (maybe not, only has access to email and identity)
                    refreshToken,
                    patreon: {
                        isLinkedPatreon: false,
                        tier: "FREE"
                    }
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
