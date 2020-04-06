const got = require('got');

const map = new Map();

const instance = got.extend({
    prefixUrl: "https://discordapp.com/api/v6",
    responseType: 'json',
    headers: {
        'Authorization': 'Bot ' + process.env.DISCORD_TOKEN
    },
    cache: map
});

module.exports = {
    discord: instance,
};
