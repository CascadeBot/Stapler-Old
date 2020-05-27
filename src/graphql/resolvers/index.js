const queryResolver = require("./query")
const mutationResolver = require("./mutation")
const guildMetaResolver = require("./query/guildMetaResolver")

const resolvers = {
    Query: queryResolver,
    GuildData: {
        Meta: guildMetaResolver.resolve
    },
    Mutation: mutationResolver,
}

module.exports = resolvers
