// api/graphql.js   (or api/index.js — name doesn’t matter)
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/landingPage/default";
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from "apollo-server-lambda";
import mongoose from "mongoose";
import { typeDefs } from "../typeDefs/index.js";
import { resolvers } from "../resolver/index.js";
import dotenv from "dotenv";

dotenv.config();

// Cache everything between invocations (Vercel keeps container warm)
let cachedHandler = null;
let cachedServer = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
};

async function getHandler() {
  if (cachedHandler) return cachedHandler;

  await connectDB();

  cachedServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins:
      process.env.NODE_ENV === "production"
        ? [ApolloServerPluginLandingPageDisabled()] // optional: hide playground in prod
        : [],
  });

  await cachedServer.start();

  cachedHandler = startServerAndCreateLambdaHandler(cachedServer, handlers, {
    context: ({ event, context }) => ({ event, context }),
  });

  return cachedHandler;
}

// Modern Vercel format (2024–2025)
export const handler = async (event, context) => {
  const lambdaHandler = await getHandler();
  return lambdaHandler(event, context);
};

// Also export config to disable Vercel's default body parsing (critical for GraphQL!)
export const config = {
  api: {
    bodyParser: false,
  },
};
