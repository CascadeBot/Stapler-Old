
let member = {
    id: "2365780942334",
    roleIds: ["6478234827342", "32342542343"],
    permissions: ["ADMINISTRATOR", "MANAGE_SERVER"]
}

let permissionUser = {
    groups: ["group"],
    permissions: ["play", "module.music"],
    evaluatePermission: function(permission) {
        for (perm in permissions) {
            if (testPermission(perm, permission)) {
                if (perm.startsWith("-")) {
                    return {
                        action: "DENY",
                        reason: "USER"
                    }
                }
                return {
                    action: "ALLOW",
                    reason: "USER"
                }
            }
        }
        return {
            action: "NEUTRAL",
            reason: "USER"
        }
    }
}

let permissionGroup = {
    id: generateId(),
    name: "hi",
    generateId: function() {
        const charSet = "abcdefghijkmnopqrstuvwxyzACDEFHJKLMNPRSTUVWXYZ123467890";
        let output = "";
        for (let i = 0; i < 5; i++) {
            output += charSet.charAt(Math.floor((Math.random() * charSet.length)))
        }
        return output;
    },
    permissions: ["play", "module.music"],
    roleIds: ["7836472343423", "34765324234"],
    evaluatePermission: function(permission) {
        for (perm in permissions) {
            if (testPermission(perm, permission)) {
                if (perm.startsWith("-")) {
                    return {
                        action: "DENY",
                        reason: "GROUP"
                    }
                }
                return {
                    action: "ALLOW",
                    reason: "GROUP"
                }
            }
        }
        return {
            action: "NEUTRAL",
            reason: "GROUP"
        }
    }
}

let result = {
    action: "ALLOW|DENY|NEUTRAL",
    reason: "GROUP|USER|DISCORD|OFFICIAL|GUILD|DEFAULT",
    reasonObject: ""
}

let permission = {
    name: "play",

}

function testPermission(permission, permissionToCompare) {
    if (permission === "*") {
        return true;
    }

    let permissionParts = permission.split(/(?:^\*(\.))|(?:(?<=\.)\*(?=\.))|(?:(?<=\.)\*$)/);
    let regex = new Array(permissionParts.map(part => "\Q" + part + "\E")).join(".+") + (permission.endsWith("*") ? ".+" : "")

    return permissionToCompare.match(regex)
}

let security = {
    "OWNER": ["34672367424", "234234342"],
    "DEVELOPER": "6783462735467234"
}

let securityLevels = ["OWNER", "DEVELOPER", "STAFF", "CONTRIBUTOR"]

let permissionUsers = [];
let permissionsGroups = [];

function securityAuthorised(userId, level) {
    const userLevel = getUserSecurityLevel(userId);
    if (!userLevel) return false;
    const userLevelPos = securityLevels.indexOf(userLevel);
    return userLevelPos <= securityLevels.indexOf(level);
}

function getUserSecurityLevel(userId) {
    for (secLevel in Object.keys(security)) {
        if (Array.isArray(security[secLevel])) {
            if (security[secLevel].includes(userId)) {
                return secLevel;
            }
        } else if (security[secLevel] === userId) {
            return secLevel;
        }
    }
}

const isDevBot = false;

const newUser = {
    groups: [],
    permissions: []
}

function evalPermission(member, permission, settingsCore, permissionMode) {
    if (securityAuthorised(member.id, "DEVELOPER")) {
        return {
            action: "ALLOW",
            reason: "OFFICAL",
            reasonObject: "DEVELOPER"
        }
    }
    if (securityAuthorised(member.id, "CONTRIBUTOR") && isDevBot) {
        return {
            action: "ALLOW",
            reason: "OFFICAL",
            reasonObject: "CONTRIBUTOR"
        }
    }

    if (member.isOwner()) {
        return {
            action: "ALLOW",
            reason: "GUILD"
        }
    }

    // If has admin perm
    if ((member.permissions & 8 == 8) && settingsCore.isAdminHaveAllPerms) {
        return {
            action: "ALLOW",
            reason: "GUILD"
        }
    }

    let user = (permissionUsers.find(user => user.id == member.id) || newUser)
    let groups = findUserGroups(member)

    let result = getDefaultAction(permission)
    let evaluatedResult = "NEUTRAL"

    if (permissionMode == "MOST_RESTRICTIVE") {
        evaluatedResult = evaluateMostRestrictiveMode(user, userGroups, permission.name)
    } else if (permissionMode == "HIERARCHICAL") {
        evaluatedResult = evaluateHierarchicalMode(user, userGroups, permission.name)
    }

    if (!(evaluatedResult == "NEUTRAL")) {
        result = evaluatedResult
    }

    if (result == "NEUTRAL" && hasDiscordPermissions(member, permission.discordPerms))
}

function findUserGroups(member) {
    let user = (permissionUsers.find(user => user.id == member.id) || newUser)
    let userGroups = permissionsGroups.filter(group => user.groups.includes(group.id));

    permissionsGroups.filter(
        group => group.some(roleId => member.roleIds.includes(roleId))
    ).forEach(group => userGroups.push(group));
    return userGroups;
}

