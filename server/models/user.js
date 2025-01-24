const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  email: String,
  friends: {
    type: [
      {
        name: { type: String, required: true }, // The first string in the pair
        googleid: { type: String, required: true }, // The second string in the pair
      },
    ],
    default: [], // Default value is an empty array
  },
  requestedOut: {
    type: [
      {
        name: { type: String, required: true }, // The first string in the pair
        googleid: { type: String, required: true }, // The second string in the pair
      },
    ],
    default: [], // Default value is an empty array
  },
  requestedIn: {
    type: [
      {
        name: { type: String, required: true }, // The first string in the pair
        googleid: { type: String, required: true }, // The second string in the pair
      },
    ],
    default: [], // Default value is an empty array
  },
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
