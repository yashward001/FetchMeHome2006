const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true }, // Pet being reported
  name: { type: String, required: true }, // Pet name
  type: { type: String, required: true }, // Pet type (Dog, Cat, etc.)
  age: { type: String, required: true }, // Pet age
  area: { type: String, required: true }, // Pet location
  justification: { type: String, required: true }, // Adoption justification
  filename: { type: String, required: true }, // Pet image filename
  email: { type: String, required: true }, // Owner email
  phone: { type: String, required: true }, // Owner phone number
  reason: { type: String, required: true }, // Why was this reported?
  createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model("Report", ReportSchema);
