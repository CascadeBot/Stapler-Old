function makeCascadeUser(user) {
    return {
        id: user._id,
        Discord: {
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            avatarURL: user.avatar ? `http://cdn.discordapp.com/avatars/${user._id}/${user.avatar}` : null,
            discriminator: user.discriminator,
            id: user._id
        },
        Patreon: {
            linked: user.patreon.isLinkedPatreon,
            tier: user.patreon.tier,
        }
    }
}

async function resolve(_parent, _args, { user }) {
    if (!user)
        return null;
    return makeCascadeUser(user);
}

module.exports = {
    makeCascadeUser,
    resolve
};
