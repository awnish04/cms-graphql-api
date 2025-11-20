// import express from "express";
// import { ApolloServer } from "apollo-server-express";
// import mongoose from "mongoose";
// import cors from "cors";
// // import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import { typeDefs } from "./typeDefs/index.js";
// import { resolvers } from "./resolver/index.js";
// import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";

// dotenv.config();
// const PORT = process.env.PORT;

// const startServer = async () => {
//   const app = express();
//   app.use(cors());
//   // app.use(
//   //   cors({
//   //     origin: [
//   //       "https://your-admin.vercel.app",
//   //       "https://your-client.vercel.app",
//   //     ],
//   //     credentials: true,
//   //   })
//   // );
//   // app.use(bodyParser.json());

//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     cache: new InMemoryLRUCache({
//       maxSize: Math.pow(2, 20) * 100, // ~100MiB
//       ttl: 300, // 5 minutes in seconds
//     }),
//     persistedQueries: false, // ✅ explicitly disable
//   });

//   await server.start(); // ✅ REQUIRED for Apollo v3
//   server.applyMiddleware({ app });

//   mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => {
//       app.listen({ port: process.env.PORT }, () => {
//         console.log(
//           `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
//         );
//       });
//     })
//     .catch((err) => console.error("MongoDB connection error:", err));
// };

// startServer(); // ✅ Call async function


import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { typeDefs } from "./typeDefs/index.js";
import { resolvers } from "./resolver/index.js";

dotenv.config();

const app = express();

// Global MongoDB connection with caching
let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });
    cachedConnection = conn;
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Create Apollo Server once (outside the handler)
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

let serverStarted = false;

// Initialize the server
async function initializeServer() {
  if (!serverStarted) {
    await server.start();
    serverStarted = true;

    // Apply middleware once
    app.use("/api/graphql", cors(), express.json(), expressMiddleware(server));

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.status(200).json({ status: "OK", message: "GraphQL API is running" });
    });

    // Root endpoint
    app.get("/", (req, res) => {
      res.json({
        message: "GraphQL API Server",
        graphqlEndpoint: "/api/graphql",
        healthCheck: "/health",
      });
    });
  }
}

// Export for Vercel serverless
export default async function handler(req, res) {
  await connectDB();
  await initializeServer();
  return app(req, res);
}