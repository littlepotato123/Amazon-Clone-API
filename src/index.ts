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

  const PORT = process.env.PORT || 4000;

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [AuthenticationResolver, Setup, ItemResolver, CartResolver, PageResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(PORT, () => {
    console.log("http://localhost:4000/graphql");
  });
})();
