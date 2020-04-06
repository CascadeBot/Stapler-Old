const requiredConfigKeys = [
    "MONGO_CONNECTION_STRING",
    "DISCORD_CLIENTID",
    "DISCORD_CLIENTSECRET",
    "HOST_ORIGIN",
    "DB_NAME",
    "DB_COLLECTION_USER",
    "DB_COLLECTION_SESSION",
    "DB_COLLECTION_GUILD",
    "SESSION_SECRET",
    "LOGIN_FAILURE_REDIRECT",
    "LOGIN_SUCCESS_REDIRECT",
    "DISCORD_TOKEN"
]

function checkString(str, key) {
    if (!str) throw new Error(`Config error: ${key} doesn't exist!`)
    if (typeof str !== "string" || str.length < 0)
        throw new Error(`Config error: ${key} is invalid!`);
}

function readConfig() {
    require('dotenv').config();
    for (let key of requiredConfigKeys) {
        checkString(process.env[key], key);
    }
}

module.exports = {
    readConfig
};
