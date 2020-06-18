const { makeGuildData } = require("./guildResolver");
const { hasAccess } = require("../../middleware/access");

async function resolve(_parent, _args, ctx) {
    const {user, data} = ctx;
    if (!user) return null;

    const userGuilds = await data.getUserGuilds(user, user._id.toString());

    const guildIds = userGuilds.map(guild => guild.id);
    const guildList = await data.getGuilds(guildIds);

    const output = [];
    for (let guild of guildList) {
        if (!(await hasAccess(ctx.data, user._id.toString(), guild._id.toString(), guild)))
            break
        let guildData = makeGuildData(guild);
        output.push(guildData);
    }
    return output;
}

module.exports = {
    resolve
};
