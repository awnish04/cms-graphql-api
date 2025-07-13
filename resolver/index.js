// import About from "../models/About.js";

// export const resolvers = {
//   Query: {
//     getAbout: async () => await About.find(),
//   },
//   Mutation: {
//     createAbout: async (_, { heading, paragraph, imageUrl }) => {
//       return await About.create({ heading, paragraph, imageUrl });
//     },
//     deleteAbout: async (_, { id }) => {
//       return await About.findByIdAndDelete(id);
//     },
//     //New Update
//     updateAbout: async (_, { id, heading, paragraph, imageUrl }) => {
//       return await About.findByIdAndUpdate(
//         id,
//         { heading, paragraph, imageUrl },
//         { new: true }
//       );
//     },
//   },
// };

import About from "../models/About.js";
import Project from "../models/Project.js"; // 🆕

export const resolvers = {
  Query: {
    getAbout: async () => await About.find(),
    getProjects: async () => await Project.find(), // 🆕
  },
  Mutation: {
    // About mutations
    createAbout: async (_, { heading, paragraph, imageUrl }) => {
      return await About.create({ heading, paragraph, imageUrl });
    },
    deleteAbout: async (_, { id }) => {
      return await About.findByIdAndDelete(id);
    },
    updateAbout: async (_, { id, heading, paragraph, imageUrl }) => {
      return await About.findByIdAndUpdate(
        id,
        { heading, paragraph, imageUrl },
        { new: true }
      );
    },

    // 🆕 Project mutations
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
  },
};
