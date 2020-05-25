const queryResolver = require("./query")
const guildMetaResolver = require("./query/guildMetaResolver")

const resolvers = {
    Query: queryResolver,
    GuildData: {
        Meta: guildMetaResolver.resolve
    },
}

module.exports = resolvers
