module.exports = [
    require("./login.js").isLoggedIn,
    require("./access.js").permissionMiddleware
];
