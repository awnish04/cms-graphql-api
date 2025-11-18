import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { typeDefs } from "../typeDefs/index.js";
import { resolvers } from "../resolver/index.js";

const app = express();
const httpServer = http.createServer(app);

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Start server function
const startServer = async () => {
  await connectDB();
  await server.start();

  app.use(
    "/api/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "GraphQL API is running" });
  });

  return app;
};

// Export the serverless function
export default async function handler(req, res) {
  const app = await startServer();
  return app(req, res);
}
