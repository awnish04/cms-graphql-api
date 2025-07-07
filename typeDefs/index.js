import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type About {
    id: ID!
    heading: String
    paragraph: String
    imageUrl: String
  }

  type Query {
    getAbout: [About]
  }

  type Mutation {
    createAbout(heading: String!, paragraph: String!, imageUrl: String!): About
    deleteAbout(id: ID!): About
  }
`;
