const meResolver = require("./meResolver")
const guildResolver = require("./guildResolver")
const guildsResolver = require("./guildsResolver");

module.exports = {
    Me: meResolver.resolve,
    Guild: guildResolver.resolve,
    Guilds: guildsResolver.resolve
}