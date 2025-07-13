import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrls: [String], // allow multiple images
  techStack: [String], // array of selected techs
  githubUrl: String,
  liveUrl: String,
});

export default mongoose.model("Project", ProjectSchema);
