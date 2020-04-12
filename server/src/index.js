const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

const resolvers = {
  Query: {
    templates: (root, args, context, info) => {
      return context.prisma.templates()
    }
  },
  Mutation: {
    save: (root, args, context) => {
      return context.prisma.createTemplate({
        description: args.description,
        name: args.name
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: request => ({
    ...request,
    prisma
  })
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
