module.exports = async (_parent, _args, { user }) => {
    if (!user) return null;
    return {
        id: user._id,
        Discord: {
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            discriminator: user.discriminator,
            id: user._id
        }
    }
}