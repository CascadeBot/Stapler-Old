const { setupLogin } = require("./setup/passport");
const { setupDB } = require("./setup/db");
const { setupRoutes, serverOptions } = require("./setup/server");
const { setupGraphqlServer } = require("./setup/graphql");
const { DiscordCore, DiscordHooks } = require("discord-user-js");
const { discord: discordConfig } = require("./helpers/config");

async function init() {
    await setupDB();
    const server = await setupGraphqlServer();
    const app = server.express;

    DiscordCore.setCredentials({
        client_id: discordConfig.client_id,
        client_secret: discordConfig.client_secret
    });

    DiscordCore.addHook(DiscordHooks.tokenUpdate, (newTokens) => {
        //TODO handle updating of tokens
    });
    setupLogin(app);
    setupRoutes(app);
    server.use((req, res, next) => {
        if (req.path.startsWith(serverOptions.endpoint)) return next();
        res.status(404).json({
          error: "endpoint not found"
        });
    })
    server.start(
        serverOptions,
        () => console.log(`Server is running on localhost:${serverOptions.port}`)
    );
}

init().catch((reason) => {
    console.error(reason);
});
