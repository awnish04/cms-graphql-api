import About from "../models/About.js";

export const resolvers = {
  Query: {
    getAbout: async () => await About.find(),
  },
  Mutation: {
    createAbout: async (_, { heading, paragraph, imageUrl }) => {
      return await About.create({ heading, paragraph, imageUrl });
    },
    deleteAbout: async (_, { id }) => {
      return await About.findByIdAndDelete(id);
    },
    //New Update
    updateAbout: async (_, { id, heading, paragraph, imageUrl }) => {
      return await About.findByIdAndUpdate(
        id,
        { heading, paragraph, imageUrl },
        { new: true }
      );
    },
  },
};
