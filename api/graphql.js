// // api/graphql.js
// import { ApolloServer } from "@apollo/server";
// import { startStandaloneServer } from "@apollo/server/standalone";
// import mongoose from "mongoose";
// import { typeDefs } from "../typeDefs/index.js"; // keep your existing folders
// import { resolvers } from "../resolver/index.js";
// import dotenv from "dotenv";

// dotenv.config();

// // Cache server + DB connection for warm invocations
// let apolloHandler;

// const connectDB = async () => {
//   if (mongoose.connection.readyState >= 1) return;
//   if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing!");
//   await mongoose.connect(process.env.MONGO_URI, {
//     maxPoolSize: 10,
//     serverSelectionTimeoutMS: 5000,
//     socketTimeoutMS: 45000,
//   });
//   console.log("MongoDB connected");
// };

// const createApolloHandler = async () => {
//   if (apolloHandler) return apolloHandler;

//   await connectDB();

//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     introspection: true, // enable Playground in prod if you want
//     plugins: process.env.NODE_ENV === "production" ? [] : [],
//   });

//   await server.start();

//   const { handleRequest } = await startStandaloneServer(server, {
//     listen: false, // we don't listen on a port
//     context: async ({ req }) => ({ req }),
//   });

//   apolloHandler = handleRequest;
//   return apolloHandler;
// };

// // Vercel expects a default export (req, res) => {}
// export default async function handler(req, res) {
//   try {
//     const apolloHandler = await createApolloHandler();
//     return apolloHandler(req, res);
//   } catch (err) {
//     console.error("Apollo handler crash:", err);
//     res.status(500).json({ error: "Server crash", message: err.message });
//   }
// }

// // Critical: disable Vercel's default body parser!
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };


// api/graphql.js
// import { ApolloServer } from "@apollo/server";
// import { startServerAndCreateNextHandler } from "@as-integrations/next";
// import mongoose from "mongoose";
// import { typeDefs } from "../typeDefs/index.js";
// import { resolvers } from "../resolver/index.js";

// // Global variable to cache connection across serverless invocations
// let cachedConnection = null;

// async function connectDB() {
//   if (cachedConnection) {
//     return cachedConnection;
//   }

//   if (!process.env.MONGO_URI) {
//     throw new Error("Missing MONGO_URI");
//   }

//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       bufferCommands: false,
//     });
//     cachedConnection = conn;
//     return conn;
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     throw error;
//   }
// }

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   introspection: true,
//   persistedQueries: false,
// });

// const handler = startServerAndCreateNextHandler(server, {
//   context: async (req, res) => {
//     await connectDB();
//     return { req, res };
//   },
// });

// export default async function graphql(req, res) {
//   // Enable CORS
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
//   if (req.method === 'OPTIONS') {
//     res.status(200).end();
//     return;
//   }
  
//   return handler(req, res);
// }

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
