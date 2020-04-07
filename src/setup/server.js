const { isProduction } = require("../helpers/utils");
const { server: serverConfig } = require("../helpers/config");
const authRouter = require("../routes/auth");
const patreonRouter = require("../routes/patreon");

const serverOptions = {
    port: serverConfig.port,
    endpoint: "/graphql",
    playground: isProduction() ? false : "/graphql",
    uploads: false
}

function setupRoutes(app) {
    app.use('/auth', authRouter);
    app.use('/patreon', patreonRouter);
}

module.exports = {
    serverOptions,
    setupRoutes
};
