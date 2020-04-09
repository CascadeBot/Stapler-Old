const { getDB } = require("../setup/db");
const { Long } = require("mongodb");
const { tierEnum } = require("../models/patreon");
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
            { _id: Long.fromString(profile.id) },
            {
                $setOnInsert: {
                    patreon: {
                        isLinkedPatreon: false,
                        tier: tierEnum.default
                    }
                },
                $set: {
                    username: profile.username,
                    discriminator: profile.discriminator,
                    avatar: profile.avatar,
                    email: profile.email,
                    accessToken,
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
    done(null, user._id.toString());
}

function discordDeserialize(id, done) {
    getDB().users.findOne(
        { _id: Long.fromString(id) },
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
