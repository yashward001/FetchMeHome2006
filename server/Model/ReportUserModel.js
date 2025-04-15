const mongoose = require("mongoose");

const ReportUserSchema = new mongoose.Schema({
  finderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reported User
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who reported
  image: { type: String, required: true }, // Image filename
  justification: { type: String, required: true }, //  Owner's justification
  status: { type: String, default: "Pending" }, // Admin can change this later
  createdAt: { type: Date, default: Date.now }, // When the report was made
});

module.exports = mongoose.model("ReportUser", ReportUserSchema);
