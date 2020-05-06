const { setupLogin } = require("./setup/passport");
const { setupDB } = require("./setup/db");
const { setupRoutes, serverOptions } = require("./setup/server");
const { setupGraphqlServer } = require("./setup/graphql");

async function init() {
    await setupDB();
    const server = await setupGraphqlServer();
    const app = server.express;

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
