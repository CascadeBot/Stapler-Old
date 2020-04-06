const { isProduction } = require("../helpers/utils");
const routes = require("../routes");

const serverOptions = {
    port: process.env.PORT || 4000,
    endpoint: "/graphql",
    playground: isProduction() ? false : "/graphql",
    uploads: false
}

function setupRoutes(app) {
    for (let key in routes) {
        app.use(routes[key]);
    }
}

module.exports = {
    serverOptions,
    setupRoutes
};
