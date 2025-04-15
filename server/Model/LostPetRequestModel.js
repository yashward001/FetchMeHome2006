const mongoose = require("mongoose");

const LostPetRequestSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: "LostPet", required: true },
  finderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the lost pet
  finderEmail: { type: String, required: true },  // Finder's email
  finderPhone: { type: String, required: true },  // Finder's phone
  image: { type: String, required: true },   
  status: { type: String, enum: ["Pending", "Accepted"], default: "Pending" }, //  New Status Field     // Image filename
  createdAt: { type: Date, default: Date.now },   // Date the request was submitted
});

module.exports = mongoose.model("LostPetRequest", LostPetRequestSchema);
