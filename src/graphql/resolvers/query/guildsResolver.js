const { DiscordUser } = require("discord-user-js");
const { makeGuildData } = require("./guildResolver");
const { resolve: resolveGuildMeta } = require("./guildMetaResolver");
const { Long } = require("mongodb");

async function resolve(_parent, _args, ctx) {
    const {db, user} = ctx;
    if (!user) return null;

    const userInstance = new DiscordUser({
        ...user,
        scopes: ["identify", "guilds"],
        userId: user._id.toString()
    });

    const userGuilds = await userInstance.getUserGuilds();
    if (!userGuilds) return null;

    let idList = userGuilds.body;
    idList = idList.map((guild) => Long.fromString(guild.id));

    const guildCursor = await db.guilds.find({ _id: {
        $in: idList
    }});
    const guildList = await guildCursor.toArray();

    const output = [];
    for (let guild of guildList) {
        let guildData = makeGuildData(guild);
        guildData.Meta = await resolveGuildMeta({ id: guildData.id }, null, ctx);
        output.push(guildData);
    }
    return output;
}

module.exports = {
    resolve
};
