const { Long } = require("mongodb");

module.exports = async (_parent, { id }, { db }) => {
  const guild = await db.guilds.findOne({ _id: Long.fromString(id) });
  return {
    id: guild._id,
    Settings: getSettings(guild),
    Tags: getTags(guild),
    EnabledModules: guild.coreSettings.enabledModules,
    EnabledFlags: guild.enabledFlags,
    Permissions: getPermissions(guild)
  };
};

const getPermissionGroups = (groups) => (
  groups.map(({id, name, roleIds, permissions}) => ({
    id,
    name,
    permissions,
    roles: roleIds,
  }))
)

const getPermissions = ({guildPermissions}) => {
  const groups = getPermissionGroups(guildPermissions.groups)
  const groupMap = new Map()
  groups.forEach(group => {
    groupMap.set(group.id, group)
  })
  return {
    mode: guildPermissions.mode,
    Groups: groups,
    Users: guildPermissions.users.map(({key, value}) => ({
      id: key,
      groups: value.groups.map(key => (groupMap.get(key))),
      permissions: value.permissions
    }))
  }
}

const getSettings = ({locale, coreSettings, guildModeration}) => ({
  locale: locale,
  mentionPrefix: coreSettings.mentionPrefix,
  deleteCommand: coreSettings.deleteCommand,
  useEmbedForMessages: coreSettings.useEmbedForMessages,
  showPermErrors: coreSettings.showPermErrors,
  showModuleErrors: coreSettings.showModuleErrors,
  adminsHaveAllPerms: coreSettings.adminsHaveAllPerms,
  allowTagCommands: coreSettings.allowTagCommands,
  helpHideCommandsNoPermission: coreSettings.helpHideCommandsNoPermission,
  helpShowAllModules: coreSettings.helpShowAllModules,
  prefix: coreSettings.prefix,
  purgePinnedMessages: guildModeration.purgePinnedMessages,
});

function getTags({coreSettings: {tags}}) {
  return Object.keys(tags).map((key) => ({
    name: key,
    content: tags[key].content,
    category: tags[key].category,
  }));
}
