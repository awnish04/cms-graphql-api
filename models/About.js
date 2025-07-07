import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  heading: String,
  paragraph: String,
  imageUrl: String,
});

export default mongoose.model("About", AboutSchema);
