const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

const resolvers = {
  Query: {
    templates: (root, args, context, info) => {
      return context.prisma.templates()
    }
  },
  Mutation: {
    save: async (root, args, context) => {

      console.log(args)
      const templates = await context.prisma.templates()
      const nameArr = templates.map (x => x.name.toUpperCase())
      if (nameArr.includes(args.name.toUpperCase()))  throw new Error('Template already exists')

      return context.prisma.createTemplate({
        description: args.description.toUpperCase(),
        name: args.name.toUpperCase(),
        account: args.account
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs: __dirname + "/schema.graphql",
  resolvers,
  context: request => ({
    ...request,
    prisma
  })
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
