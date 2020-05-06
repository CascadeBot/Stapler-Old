const { GraphQLServer } = require("graphql-yoga");
const { getDB } = require("./db");
const { DiscordBot } = require("discord-user-js");
const { discord: discordConfig } = require("../helpers/config");
const resolvers = require("../graphql/resolvers");

async function setupGraphqlServer() {
    const botClient = new DiscordBot(discordConfig.bot_token);
    await botClient.setup();

    const isLoggedIn = async (resolve, parent, args, ctx, info) => {
        if (!ctx.req.user) {
            throw new Error(`Not authorised!`);
        }
        return resolve();
    };
    
    const permissions = {
        Query: {
            Me: isLoggedIn,
        },
    };
    
    // create server instance
    const server = new GraphQLServer({
        typeDefs: `${__dirname}/../graphql/schema.graphql`,
        resolvers,
        middlewares: [permissions],
        context: (req) => {
            return {
                req: req.request,
                db: getDB(),
                user: req.request.user,
                botClient
            };
        },
    });

    return server;
}

module.exports = {
    setupGraphqlServer
};
