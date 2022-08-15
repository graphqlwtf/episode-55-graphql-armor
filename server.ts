import { createServer } from "@graphql-yoga/node";
import { EnvelopArmor } from "@escape.tech/graphql-armor";

const armor = new EnvelopArmor({
  blockFieldSuggestion: {
    enabled: true,
  },
  maxDepth: {
    enabled: true,
    n: 10,
  },
  costLimit: {
    enabled: true,
    maxCost: 50,
    objectCost: 2,
    scalarCost: 1,
    depthCostFactor: 1.5,
    ignoreIntrospection: true,
  },
  maxAliases: {
    enabled: true,
    n: 3,
  },
  characterLimit: {
    enabled: true,
    maxLength: 100,
  },
  maxDirectives: {
    enabled: true,
    n: 1,
  },
});

const { plugins } = armor.protect();

const posts = [{ id: "graphql", title: "Learn GraphQL with GraphQL.wtf" }];

const server = createServer({
  schema: {
    typeDefs: [
      /* GraphQL */ `
        type Query {
          posts: [Post]
          post(id: ID!): Post
        }

        type Post {
          id: ID!
          title: String!
          related: [Post]
        }
      `,
    ],
    resolvers: {
      Query: {
        posts: () => posts,
        post: (_, args) => posts.find((post) => post.id === args.id),
      },
      Post: {
        related: () => posts,
      },
    },
  },
  plugins: [...plugins],
  maskedErrors: false,
});

server.start();
