const mongoose = require("mongoose");

//define a story schema for the database
const StorySchema = new mongoose.Schema({
  creator_id: String,
  creator_name: String,
  content: String,
  publicId: String, //for cloudinary image
  alt: String, //image description if not load or something
});

// compile model from schema
module.exports = mongoose.model("story", StorySchema);
