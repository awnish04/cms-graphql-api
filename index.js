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
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { typeDefs } from "./typeDefs/index.js";
import { resolvers } from "./resolver/index.js";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";

dotenv.config();
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  const app = express();

  // ✅ Define allowed frontend domains
  const allowedOrigins = [
    "https://graph-ql-full-stack.vercel.app",
    "https://graph-ql-full-stack-yqg6.vercel.app",
  ];

  // ✅ Secure CORS configuration
  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like curl, Postman, mobile apps)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          console.error(`❌ CORS blocked: ${origin}`);
          return callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true, // if using cookies or Authorization headers
    })
  );

  // ✅ Use Express's built-in body parser
  app.use(express.json());

  // ✅ Apollo Server setup
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    cache: new InMemoryLRUCache({
      maxSize: Math.pow(2, 20) * 100, // ~100MB
      ttl: 300, // 5 minutes
    }),
    persistedQueries: false,
  });

  await server.start();
  server.applyMiddleware({ app });

  // ✅ MongoDB connection
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      app.listen({ port: PORT }, () => {
        console.log(
          `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
        );
      });
    })
    .catch((err) => console.error("MongoDB connection error:", err));
};

startServer();
