import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { AuthenticationResolver } from "./resolvers/Authentication";
import { CartResolver } from "./resolvers/CartResolver";
import { ItemResolver } from "./resolvers/ItemResolver";
import { PageResolver } from "./resolvers/PageResolver";
import { Setup } from "./resolvers/Setup";

(async () => {
  const app = express();

  await createConnection();


  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [AuthenticationResolver, CartResolver, ItemResolver, PageResolver, Setup]
    }),
    context: ({ req, res }) => ({ req, res }),
    introspection: true,
  });

  apolloServer.applyMiddleware({ app, cors: false });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/graphql`);
  });
})();