const { Long } = require("mongodb");

module.exports = async (_parent, { id }, { db }) => {
  const guild = await db.guilds.findOne({ _id: Long.fromString(id) });
  return {
    id: guild._id,
    Settings: getSettings(guild),
    Tags: getTags(guild),
    EnabledModules: guild.core.enabledModules,
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

const getPermissions = ({management: {permissions}}) => {
  const groups = getPermissionGroups(permissions.groups)
  const groupMap = new Map()
  groups.forEach(group => {
    groupMap.set(group.id, group)
  })
  return {
    mode: permissions.mode,
    Groups: groups,
    Users: permissions.users.map(({key, value}) => ({
      id: key,
      groups: value.groups.map(key => (groupMap.get(key))),
      permissions: value.permissions
    }))
  }
}

const getSettings = ({core, moderation, management}) => ({
  locale: core.locale,
  mentionPrefix: core.mentionPrefix,
  deleteCommand: core.deleteCommand,
  useEmbedForMessages: core.useEmbedForMessages,
  showPermErrors: core.showPermErrors,
  showModuleErrors: core.showModuleErrors,
  adminsHaveAllPerms: core.adminsHaveAllPerms,
  allowTagCommands: management.allowTagCommands,
  helpHideCommandsNoPermission: core.helpHideCommandsNoPermission,
  helpShowAllModules: core.helpShowAllModules,
  prefix: core.prefix,
  purgePinnedMessages: moderation.purgePinnedMessages,
});

function getTags({management: {tags}}) {
  return Object.keys(tags).map((key) => ({
    name: key,
    content: tags[key].content,
    category: tags[key].category,
  }));
}
