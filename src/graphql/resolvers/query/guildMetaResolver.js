module.exports = async (parent, _args, { discord }) => {
  const id = parent.id.toString();

  const { body: discordGuild } = await discord.get(`/guilds/${id}`);
  return {
    id: discordGuild.id,
    ownerID: discordGuild.owner_id,
    iconURL: discordGuild.icon,
    name: discordGuild.name,
    memberCount: -1337, // temp
    roles: discordGuild.roles.map((role) => ({
      id: role.id,
      name: role.name,
      color: role.color,
    })),
  };
};
