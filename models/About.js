import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  paragraph: String,
});

export default mongoose.model("About", AboutSchema);
