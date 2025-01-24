const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  /*friendIds: {
    type: [String], // Array of strings
    default: [], // Default value: empty array
  },*/
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
