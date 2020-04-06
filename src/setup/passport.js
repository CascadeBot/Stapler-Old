const passport = require("passport");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const { isProduction } = require("../helpers/utils");
const { getDB } = require("./db");
const { discordStrategy, discordSerialize, discordDeserialize } = require('../auth/discord.js');

function setupLogin(app) {
    const sessionOptions = {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: isProduction(),
            maxAge: 3600000
        },
        store: new MongoStore({
            client: getDB().client,
            dbName: process.env.DB_NAME
        })
    };

    // setup login strategy
    passport.use(discordStrategy);
    passport.serializeUser(discordSerialize);
    passport.deserializeUser(discordDeserialize);

    // trust first proxy
    if (isProduction()) {
        app.set('trust proxy', 1);
    }

    // setup express middleware
    app.use(session(sessionOptions));
    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = {
    setupLogin
};
