function makeGuildMeta(guild) {
  return {
    id: guild.id,
    ownerID: guild.owner_id,
    iconURL: guild.icon ? `http://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : null,
    iconHash: guild.icon,
    name: guild.name,
    memberCount: guild.approximate_member_count,
    roles: guild.roles.map((role) => ({
      id: role.id,
      name: role.name,
      color: role.color,
    })),
  };
}

async function resolve(parent, _args, { botClient }) {
  const id = parent.id.toString();

  const { body: discordGuild } = await botClient.getGuild(id, true);
  return makeGuildMeta(discordGuild);
}

module.exports = {
  makeGuildMeta,
  resolve
};
