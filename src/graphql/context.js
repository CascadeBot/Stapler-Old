const { RequestDataLoader } = require("../models/dataload");
const { getDB } = require("../setup/db");

module.exports = {
    makeGraphqlContext: ({botClient}) => req => ({
        req: req.request,
        db: getDB(),
        user: req.request.user,
        botClient,
        data: new RequestDataLoader(botClient)
    })
};
