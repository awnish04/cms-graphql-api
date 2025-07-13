// import { gql } from "apollo-server-express";
// export const typeDefs = gql`
//   type About {
//     id: ID!
//     heading: String
//     paragraph: String
//     imageUrl: String
//   }

//   type Project {
//     id: ID!
//     title: String
//     description: String
//     imageUrls: [String]
//     techStack: [String]
//     githubUrl: String
//     liveUrl: String
//   }

//   type Query {
//     getAbout: [About]
//     getProjects: [Project]
//   }

//   type Mutation {
//     createAbout(heading: String!, paragraph: String!, imageUrl: String!): About
//     updateAbout(
//       id: ID!
//       heading: String!
//       paragraph: String!
//       imageUrl: String!
//     ): About
//     deleteAbout(id: ID!): About

//     createProject(
//       title: String!
//       description: String!
//       imageUrls: [String!]!
//       techStack: [String!]!
//       githubUrl: String!
//       liveUrl: String!
//     ): Project

//     updateProject(
//       id: ID!
//       title: String!
//       description: String!
//       imageUrls: [String!]!
//       techStack: [String]!
//       githubUrl: String!
//       liveUrl: String!
//     ): Project
//     deleteProject(id: ID!): Project
//   }
// `;


import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type About {
    id: ID!
    heading: String
    paragraph: String
    imageUrl: String
  }

  type Project {
    id: ID!
    title: String
    description: String
    imageUrls: [String!]! # ✅ imageUrls must be a non-null array of non-null strings
    techStack: [String!]! # ✅ same for techStack
    githubUrl: String
    liveUrl: String
  }

  type Query {
    getAbout: [About]
    getProjects: [Project]
  }

  type Mutation {
    # ✅ About mutations
    createAbout(heading: String!, paragraph: String!, imageUrl: String!): About

    updateAbout(
      id: ID!
      heading: String!
      paragraph: String!
      imageUrl: String!
    ): About

    deleteAbout(id: ID!): About

    # ✅ Project mutations
    createProject(
      title: String!
      description: String!
      imageUrls: [String!]! # ✅ required and clean
      techStack: [String!]! # ✅ required and clean
      githubUrl: String!
      liveUrl: String!
    ): Project

    updateProject(
      id: ID!
      title: String!
      description: String!
      imageUrls: [String!]!
      techStack: [String!]!
      githubUrl: String!
      liveUrl: String!
    ): Project

    deleteProject(id: ID!): Project
  }
`;
