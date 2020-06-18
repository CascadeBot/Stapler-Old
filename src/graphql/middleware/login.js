const isLoggedIn = async (resolve, parent, args, ctx, info) => {
    if (!ctx.req.user) {
        throw new Error(`Not authorized!`);
    }
    return resolve();
};

const loginMiddleware = {
    Query: {
        Me: isLoggedIn,
    },
};

module.exports = {
    isLoggedIn,
    loginMiddleware
};
