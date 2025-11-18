import { gql } from "apollo-server-express";

export const typeDefs = gql`
  # =======================
  # ABOUT
  # =======================
  type About {
    id: ID!
    paragraph: String
  }

  # =======================
  # PROJECTS
  # =======================
  type Project {
    id: ID!
    title: String
    description: String
    imageUrls: [String!]! # ✅ imageUrls must be a non-null array of non-null strings
    techStack: [String!]! # ✅ same for techStack
    githubUrl: String
    liveUrl: String
  }

  # =======================
  # SKILLS
  # =======================
  type Skill {
    id: ID!
    name: String!
    imageUrl: String!
  }

  type Query {
    getAbout: [About]
    getProjects: [Project]
    getSkills: [Skill] # 🆕
  }

  type Mutation {
    # ✅ About mutations
    createAbout(paragraph: String!): About

    updateAbout(
      id: ID!
      paragraph: String!
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

    # 🆕 SKILLS
    createSkill(name: String!, imageUrl: String!): Skill!
    updateSkill(id: ID!, name: String!, imageUrl: String!): Skill!
    deleteSkill(id: ID!): Skill!
  }
`;
