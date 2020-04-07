const got = require('got');
const { discord: discordConfig } = require('./config');

const map = new Map();

const instance = got.extend({
    prefixUrl: discordConfig.api_host,
    responseType: 'json',
    headers: {
        'Authorization': 'Bot ' + discordConfig.bot_token
    },
    cache: map //TODO: ratelimit
});

function isAuthenticated(req, res, next) {
    if (typeof req.user !== "undefined" &&
        typeof req.user._id !== "undefined")
        return next();
    return res.redirect("/auth/login");
}

module.exports = {
    discord: instance,
    isAuthenticated
};
