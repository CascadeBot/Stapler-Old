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

const permissionsMap = {
    "ADMINISTRATOR": 0x8,
    "MANAGE_GUILD": 0x20
};

function hasPermission(permissions, perm) {
    if (typeof permissionsMap[perm] === "undefined") return false;
    return permissions & permissionsMap[perm] == permissionsMap[perm];
}

module.exports = {
    discord: instance,
    isAuthenticated,
    hasPermission,
    permissionsMap
};
