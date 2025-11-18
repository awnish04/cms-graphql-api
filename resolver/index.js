import About from "../models/About.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";

export const resolvers = {
  Query: {
    getAbout: async () => await About.find(),
    getProjects: async () => await Project.find(),

    getSkills: async () => await Skill.find(), // 🆕
  },
  Mutation: {
    // -----------------------
    // About Mutation
    // -----------------------
    createAbout: async (_, { paragraph }) => {
      return await About.create({ paragraph});
    },
    deleteAbout: async (_, { id }) => {
      return await About.findByIdAndDelete(id);
    },
    updateAbout: async (_, { id,paragraph}) => {
      return await About.findByIdAndUpdate(
        id,
        { paragraph },
        { new: true }
      );
    },

    // -----------------------
    createProject: async (
      _,
      { title, description, imageUrls, techStack, githubUrl, liveUrl }
    ) => {
      return await Project.create({
        title,
        description,
        imageUrls: imageUrls ?? [], // ✅ fallback to empty array
        techStack: techStack ?? [], // ✅ fallback to empty array
        githubUrl,
        liveUrl,
      });
    },

    updateProject: async (
      _,
      { id, title, description, imageUrls, techStack, githubUrl, liveUrl }
    ) => {
      return await Project.findByIdAndUpdate(
        id,
        {
          title,
          description,
          imageUrls: imageUrls ?? [],
          techStack: techStack ?? [],
          githubUrl,
          liveUrl,
        },
        { new: true }
      );
    },

    deleteProject: async (_, { id }) => {
      return await Project.findByIdAndDelete(id);
    },
    // -----------------------
    // 🆕 SKILLS
    // -----------------------
    createSkill: async (_, { name, imageUrl }) => {
      return await Skill.create({ name, imageUrl });
    },
    updateSkill: async (_, { id, name, imageUrl }) => {
      return await Skill.findByIdAndUpdate(
        id,
        { name, imageUrl },
        { new: true }
      );
    },
    deleteSkill: async (_, { id }) => {
      return await Skill.findByIdAndDelete(id);
    },
  },
};
