const { GraphQLServer } = require("graphql-yoga");
const routes = require("./routes");
const resolvers = require("./graphql/resolvers");

const isLoggedIn = async (resolve, parent, args, ctx, info) => {
  if (false) {
    throw new Error(`Not authorised!`);
  }

  return resolve();
};

const permissions = {
  Query: {
    Me: isLoggedIn,
  },
};

const server = new GraphQLServer({
  typeDefs: `${__dirname}/graphql/schema.graphql`,
  resolvers,
  middlewares: [permissions],
  context: (req) => {
    return {};
  },
});

server.express.use(routes);
server.start(
  {
    port: process.env.PORT || 4000,
    endpoint: "/graphql",
    playground: process.env.NODE_ENV === "production" ? false : "/__graphql",
    uploads: false,
  },
  () =>
    console.log(`Server is running on localhost:${process.env.PORT || 4000}`)
);
