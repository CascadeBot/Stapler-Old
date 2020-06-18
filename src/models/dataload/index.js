const { getDB } = require("../../setup/db");
const { DiscordUser } = require("discord-user-js");
const { Long } = require("mongodb");

class RequestDataLoader {
    constructor(botclient) {
        this.userGuilds = {};
        this.guilds = {};
        this.discordGuilds = {};
        this.guildMembers = {};
        this.botclient = botclient;
    }

    async getSingleGuild(id) {
        if (this.guilds[id]) return this.guilds[id];

        const guild = await getDB().guilds.findOne({ _id: Long.fromString(id) });
        if (!guild) return false;

        this.guilds[id] = guild;
        return guild;
    }

    async getGuilds(ids) {
        const loaded = [];

        // filter out already loaded guilds
        ids = ids.filter(id => {
            const alreadyLoaded = Boolean(this.guilds[id]);
            if (alreadyLoaded) loaded.push(this.guilds[id]);
            return !alreadyLoaded;
        });

        if (ids.length == 0)
            return loaded;
        
        // get remaining guilds from database
        ids = ids.map(id => Long.fromString(id));
        const guildCursor = await getDB().guilds.find({ _id: {
            $in: ids
        }});
        const guildList = await guildCursor.toArray();

        // save new guilds into cache
        guildList.forEach((guild) => {
            this.guilds[guild._id.toString()] = guild;
        });

        return [...guildList, ...loaded];
    }

    async getDiscordGuild(id) {
        if (this.discordGuilds[id]) return this.discordGuilds[id];
        const { body: discordGuild } = await this.botclient.getGuild(id, true);
        if (!discordGuild) return false;

        this.discordGuilds[id] = discordGuild;
        return discordGuild;
    }

    async getUserGuilds(user, userId) {
        if (!userId) return false;

        if (this.userGuilds[userId]) {
            return this.userGuilds[userId];
        }

        const userInstance = new DiscordUser({
            ...user,
            scopes: ["identify", "guilds"],
            userId,
        });
    
        const userGuilds = await userInstance.getUserGuilds();
        if (!userGuilds) return false;

        let idList = userGuilds.body;
        this.userGuilds[userId] = idList;

        if (idList.length <= 0) {
            return [];
        }
        return idList;
    }

    async getGuildMember(guildId, userId) {
        const idString = `${guildId}-${userId}`;
        if (this.guildMembers[idString]) return this.guildMembers[idString];
        const { body: guildMember } = await this.botclient.getMember(guildId, userId);
        if (!guildMember) return false;

        this.guildMembers[idString] = guildMember;
        return guildMember;
    }
}

module.exports = { RequestDataLoader };
