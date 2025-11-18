import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { typeDefs } from "../typeDefs/index.js";
import { resolvers } from "../resolver/index.js";

dotenv.config();

const app = express();

// CORS configuration for Vercel
app.use(
  cors({
    origin: [
      "https://your-frontend-domain.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true, // Enable for production
      playground: true, // Enable GraphQL playground
    });

    await server.start();
    server.applyMiddleware({
      app,
      path: "/api/graphql",
      cors: false, // We already handle CORS above
    });

    // Health check endpoint
    app.get("/api/health", (req, res) => {
      res.json({ status: "OK", message: "GraphQL API is running" });
    });

    // Root endpoint
    app.get("/", (req, res) => {
      res.redirect("/api/graphql");
    });

    console.log(`GraphQL Server ready at /api/graphql`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Initialize server
startServer();

// Export for Vercel
export default app;
