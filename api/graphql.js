// api/graphql.js
import { ApolloServer } from "@apollo/server";
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from "@as-integrations/vercel";
import mongoose from "mongoose";
import { typeDefs } from "../typeDefs/index.js";
import { resolvers } from "../resolver/index.js";
import dotenv from "dotenv";

dotenv.config();

// Global variables so they persist between invocations (Vercel warm containers)
let handler = null;
let server = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGO_URI, {
    // These options are crucial for Vercel/serverless
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
};

const createHandler = async () => {
  if (handler) return handler;

  await connectDB();

  server = new ApolloServer({
    typeDefs,
    resolvers,
    // Optional: disable introspection in production if you want
    // introspection: process.env.NODE_ENV !== "production",
  });

  await server.start();

  handler = startServerAndCreateLambdaHandler(server, handlers, {
    context: async ({ req }) => ({ req }),
  });

  return handler;
};

export const GET = createHandler;
export const POST = createHandler;
// Vercel needs both GET and POST exported for the same handler
