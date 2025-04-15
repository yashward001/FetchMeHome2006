const mongoose = require("mongoose");

const LostPetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  petAge: {
    type: String, // Keeping as String in case the age is in months or unknown
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Dog", "Cat", "Rabbit", "Bird", "Fish", "Other"], // Restrict to valid types
  },
  lastSeenLocation: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  filename: {
    type: String, // Stores the image filename for retrieval
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the User model
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._-]+@gmail\.com$/, // Validate Gmail-only emails
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Missing", "Found"], // Status changes when pet is found
    default: "Missing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LostPet = mongoose.model("LostPet", LostPetSchema);
module.exports = LostPet;
