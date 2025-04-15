const mongoose = require("mongoose");

const LostPetReportSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: "LostPet", required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  petAge: { type: String, required: true },
  lastSeenLocation: { type: String, required: true },
  description: { type: String, required: true },
  filename: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LostPetReport", LostPetReportSchema);
