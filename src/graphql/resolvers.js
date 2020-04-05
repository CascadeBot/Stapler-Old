const resolvers = {
    Query: {
        Me: async (_parent, _args, _) => {
            return {
                Discord: {
                    username: "KEK"
                }
            }
        },
    },
}

module.exports = resolvers
