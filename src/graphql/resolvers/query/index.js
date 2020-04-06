const meResolver = require("./meResolver")
const guildResolver = require("./guildResolver")

module.exports = {
    Me: meResolver,
    Guild: guildResolver,
}