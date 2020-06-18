const { GraphQLServer } = require("graphql-yoga");
const { DiscordBot } = require("discord-user-js");
const { discord: discordConfig } = require("../helpers/config");
const resolvers = require("../graphql/resolvers");
const middlewares = require("../graphql/middleware");
const { makeGraphqlContext } = require("../graphql/context");

async function setupGraphqlServer() {
    const botClient = new DiscordBot(discordConfig.bot_token);
    await botClient.setup();

    // create server instance
    const server = new GraphQLServer({
        typeDefs: `${__dirname}/../graphql/schema.graphql`,
        resolvers,
        middlewares,
        context: makeGraphqlContext({
            botClient
        }),
    });

    return server;
}

module.exports = {
    setupGraphqlServer
};
