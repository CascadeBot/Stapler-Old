module.exports = async (parent, _args, { botClient }) => {
  const id = parent.id.toString();

  const { body: discordGuild } = await botClient.getGuild(id, true);
  return {
    id: discordGuild.id,
    ownerID: discordGuild.owner_id,
    iconURL: discordGuild.icon ? `http://cdn.discordapp.com/icons/${discordGuild.id}/${discordGuild.icon}` : undefined,
    iconHash: discordGuild.icon,
    name: discordGuild.name,
    memberCount: discordGuild.approximate_member_count,
    roles: discordGuild.roles.map((role) => ({
      id: role.id,
      name: role.name,
      color: role.color,
    })),
  };
};
