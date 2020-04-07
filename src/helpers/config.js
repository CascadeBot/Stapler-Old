const fs = require("fs");
const path = require("path");

/*
 * Configuration file path, relative to current file.
 * Can be .json file or .js file.
 * A .js file must export the object.
 */
const configPath = "../../config.json";

/*
 * Template for config.
 * Set key to something for a default config value.
 * Setting key to `null` will disable defaults for that value
 */
const configTemplate = {
    mongo: {
        connection_string: null, // connection string, MAY NOT have a database name
        db_name: null, // database name
        collections: {
            users: "users", // collection name for the dashboard user collection
            sessions: "sessions", // collection name for the login sessions collection
            guilds: "guilds", // collection name for the guilds collection, has to be the same as the bot
        }
    },
    login: {
        redirects: {
            success: null, // redirect url for a successfull login, full url only
            failure: null, // redirect url for a failed login, full url only
        },
        session_secret: null, // secret for session encryption
        cookie_name: "dash.login", // name for session cookie
        cookie_maxage: 1000 * 60 * 60 * 24 * 7, // max age, defaults to one week
        host_origin: null // domain name host, MAY NOT end with a slash. example: `https://cascadebot.org/api` OR `http://www.cascadebot.org`
    },
    discord: {
        api_host: "https://discordapp.com/api/v6", // discord api host
        client_id: null, // discord application client id, used for Oauth
        client_secret: null, // discord application client secret, used for Oauth
        bot_token: null, // discord bot token, used for extra guild information
    },
    patreon: {
        auth_url: "https://www.patreon.com/oauth2/authorize", // patreon oauth auth url
        token_url: "https://www.patreon.com/api/oauth2/token", // patreon oauth token url
        api_host: "https://www.patreon.com/api/oauth2/v2", // patreon api root
        client_id: null, // patreon client id, used for account linking
        client_secret: null, // patreon client secret, used for account linking
        webhook: {
            identifier: null, // patreon webhook identifier, used for webhook endpoint: `/patreon/webhook/{identifier}`
            secret: null // patreon webhook secret, used for verifying if patreon is origin
        }
    },
    server: {
        port: 4000 // port to host the webserver on
    },
    env: "development" // what environment to run in, can also be `production`
}

let config = null;

function throwConfigError(path, key, expected, got) {
    const currentPath = ["config", ...path, key].join(".");
    console.error(`CONFIGURATION ERROR:\nUnexpected config value at ${currentPath}\n\nExpected: ${expected}\nfound: ${got}`);
    throw new Error("Configuration error");
}

function setPathedConfigValue(path, key, value) {
    let traverse = config;
    for (let part of path) {
        traverse = traverse[part];
    }
    traverse[key] = value;
}

function verifyConfigObject(path, template, obj) {
    const keys = Object.keys(template);
    for (let key of keys) {
        if (template[key] === null) {
            if (typeof obj[key] === "undefined")
                throwConfigError(path, key, "any", "undefined");
            setPathedConfigValue(path, key, obj[key]);
        }
        else if (typeof template[key] === "object") {
            if (typeof obj[key] !== "object" || obj[key] === null)
                throwConfigError(path, key, "object", typeof obj[key]);
            setPathedConfigValue(path, key, {});
            verifyConfigObject([...path, key], template[key], obj[key]);
        }
        else {
            if (typeof obj[key] === "undefined")
                setPathedConfigValue(path, key, template[key]);
            else
                setPathedConfigValue(path, key, obj[key]);
        }
    }
}

function readConfig() {
    if (!fs.existsSync(path.join(__dirname, configPath))) throw new Error("Config file can't be found!");
    const newConfig = require(configPath);
    if (typeof newConfig !== "object")
        throwConfigError([], "", "object", typeof newConfig);
    config = {};
    verifyConfigObject([], configTemplate, newConfig);
    process.env.NODE_ENV = config.env;
}

readConfig();

module.exports = config;
