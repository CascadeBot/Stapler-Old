const { Long } = require("mongodb");

module.exports = async (_parent, { id }, { db }) => {
  const guild = await db.guilds.findOne({ _id: Long.fromString(id) });
  return {
    id: guild._id,
    Settings: getSettings(guild),
    Tags: getTags(guild),
    EnabledModules: guild.coreSettings.enabledModules,
    EnabledFlags: guild.enabledFlags,
  };
};

const getSettings = (guild) => ({
  locale: guild.locale,
  mentionPrefix: guild.coreSettings.mentionPrefix,
  deleteCommand: guild.coreSettings.deleteCommand,
  useEmbedForMessages: guild.coreSettings.useEmbedForMessages,
  showPermErrors: guild.coreSettings.showPermErrors,
  showModuleErrors: guild.coreSettings.showModuleErrors,
  adminsHaveAllPerms: guild.coreSettings.adminsHaveAllPerms,
  allowTagCommands: guild.coreSettings.allowTagCommands,
  helpHideCommandsNoPermission: guild.coreSettings.helpHideCommandsNoPermission,
  helpShowAllModules: guild.coreSettings.helpShowAllModules,
  prefix: guild.coreSettings.prefix,
  purgePinnedMessages: guild.guildModeration.purgePinnedMessages,
});

function getTags(guild) {
  const { tags } = guild.coreSettings;

  return Object.keys(tags).map((key) => ({
    name: key,
    content: tags[key].content,
    category: tags[key].category,
  }));
}
