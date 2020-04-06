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
        name: 'dash.login',
        rolling: true, // reset cookie expiry every request
        cookie: {
            secure: isProduction(),
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
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
