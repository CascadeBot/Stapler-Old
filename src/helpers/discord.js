function isAuthenticated(req, res, next) {
    if (typeof req.user !== "undefined" &&
        typeof req.user._id !== "undefined")
        return next();
    return res.redirect("/auth/login");
}

const permissionsMap = {
    "ADMINISTRATOR": 0x8,
    "MANAGE_GUILD": 0x20
};

function hasPermission(permissions, perm) {
    if (typeof permissionsMap[perm] === "undefined") return false;
    return permissions & permissionsMap[perm] == permissionsMap[perm];
}

module.exports = {
    isAuthenticated,
    hasPermission,
    permissionsMap
};
