const Report = require("../Model/ReportModel");
const ReportUser = require('../Model/ReportUserModel');
const LostPetReport = require("../Model/LostPetReportModel");

// Fetch all reported listings (adoption + lost pets)
const getReportedListings = async (req, res) => {
  try {
    console.log("Fetching all reported listings...");

    const adoptionReports = await Report.find().lean();
    const lostPetReports = await LostPetReport.find().lean();

    const combinedReports = [
      ...adoptionReports.map(report => ({ ...report, reportType: "Adoption" })),
      ...lostPetReports.map(report => ({ ...report, reportType: "LostPet" })),
    ];

    if (combinedReports.length === 0) {
      return res.status(404).json({ message: "No reported listings found." });
    }

    console.log("Found reported listings:", combinedReports);
    res.status(200).json(combinedReports);
  } catch (err) {
    console.error("Error fetching reported listings:", err);
    res.status(500).json({ error: err.message });
  }
};

// Report a user
const reportUser = async (req, res) => {
  try {
    const { finderId, reportedBy, justification } = req.body;
    const image = req.file ? req.file.filename : null;

    console.log("Incoming report body:", req.body);
    console.log("Uploaded file:", req.file);

    if (!finderId || !reportedBy || !justification) {
      console.log("Missing fields:", { finderId, reportedBy, justification });
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (!image) {
      console.log("Image is required but missing");
      return res.status(400).json({ error: "Image is required." });
    }

    const newReport = new ReportUser({
      finderId,
      reportedBy,
      image,
      justification,
      status: "Pending",
    });

    console.log("Saving report to DB with:", { finderId, reportedBy, image, justification });

    try {
      const saved = await newReport.save();
      console.log("Successfully saved report:", saved);
      res.status(201).json({ message: "User reported successfully." });
    } catch (dbErr) {
      console.error("MongoDB Error:", dbErr);
      res.status(500).json({ error: "Mongo save failed", details: dbErr.message });
    }

  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ error: "Failed to report user." });
  }
};

// Fetch all reported users
const getReportedUsers = async (req, res) => {
  try {
    console.log("Fetching all reported users...");
  
    const reportedUsers = await ReportUser.find().sort({ createdAt: -1 });

    if (!reportedUsers.length) {
      return res.status(404).json({ message: "No reported users found." });
    }

    console.log("Found reported users:", reportedUsers);
    res.status(200).json(reportedUsers);
  } catch (err) {
    console.error("Error fetching reported users:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  getReportedListings,
  reportUser,
  getReportedUsers
};

