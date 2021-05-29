const common = require("@cascadebot/common");
const { Long: kotlinLong } = require("kotlin");
const { ArrayList: kotlinList } = require("kotlin").kotlin.collections;
const { PermissionsEvaluator, PermissionEvalContext, CascadePermission, DiscordPermission, PermissionMode, Allow: cascadeAllow } = common.org.cascadebot.common.permissions;
const { PermissionUser, PermissionGroup } = common.org.cascadebot.common.permissions.objects;
const { isProduction } = require("../../helpers/utils");

function permBool(res) {
    if (res instanceof cascadeAllow) {
        return true;
    }
    return false;
}

const hasAccess = async (data, userId, guildId, guildData) => {
    try {
        // gather data
        const requests = [];
        requests.push(data.getDiscordGuild(guildId));
        requests.push(data.getGuildMember(guildId, userId));
        if (!guildData)
            requests.push(data.getSingleGuild(guildId));

        const requestResults = await Promise.all(requests);
        discordGuild = requestResults[0];
        guildMember = requestResults[1];
        if (requestResults[2])
            guildData = requestResults[2];

        // get easy values
        const memberRoles = guildMember.roles;
        const isUserOwner = discordGuild.owner_id === guildMember.user.id;
        const adminsHaveAllPerms = guildData.core.adminsHaveAllPerms;
        const permissionMode = PermissionMode[guildData.management.mode];

        // calculate permissions for user
        let permNum = 0;
        // permissions for @everyone role
        permNum |= discordGuild.roles.find(role => role.id == guildId).permissions;
        // permissions for other roles
        memberRoles.forEach(roleId => {
            const role = discordGuild.roles.find(r => r.id === roleId);
            permNum |= role.permissions;
        });
        const userPermissions = DiscordPermission.Companion.fromRaw(permNum);

        // make group instances
        const groups = guildData.management.permissions.groups.map((group) => {

            const newGroup = PermissionGroup.Companion.createPermissionGroup(group.name, group.id);

            group.permissions.forEach(perm => {
                newGroup.addPermission(perm);
            });
            
            group.roleIds.forEach(role => {
                newGroup.linkRole(new kotlinLong(role));
            });

            return newGroup;
        });

        // make user instance
        const permissionUserData = guildData.management.permissions.users.find((user) => user.key.toString() === userId);

        const permissionUser = new PermissionUser();
        if (permissionUserData) {
            // add groups and permissions if its stored in db
            permissionUserData.value.permissions.forEach(perm => {
                permissionUser.addPermission(perm);
            });

            permissionUserData.value.groups.forEach(group => {
                permissionUser.addGroupById(group.id);
            });
        }

        // make eval context
        const contextValues = Object.values({
            developmentBot: !isProduction(),
            permissionMode,
            userId: new kotlinLong(guildMember.user.id),
            user: permissionUser,
            userLevel: null,
            groups: new kotlinList(groups),
            userPermissions,
            memberRoles: new kotlinList(memberRoles.map(role => new kotlinLong(role))),
            isUserOwner,
            adminsHaveAllPerms
        });
        const permissionContext = new PermissionEvalContext(...contextValues);

        // make dashboard access permission to test
        const permission = new CascadePermission("dashboard.access", false, null, []);

        // evaluate permission
        return permBool(PermissionsEvaluator.evalPermission(permissionContext, permission));
    } catch (e) {
        console.log("--- wtf ---");
        console.error(e);
        return false;
    }
}

const hasAccessIdVariable = async (resolve, _, { id }, { data, user }) => {
    if (!(await hasAccess(data, user._id.toString(), id)))
        throw new Error("Forbidden");
    return resolve();
}

const permissionMiddleware = {
    Query: {
        Guild: hasAccessIdVariable
    },
    Mutation: {
        UpdateGuildSettings: hasAccessIdVariable
    }
}

module.exports = {
    hasAccess,
    permissionMiddleware
};
