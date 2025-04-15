const express = require('express');
const router = express.Router();
const multer = require("multer");

const {
  getReportedListings,
  reportUser,
  getReportedUsers
} = require("../Controller/ReportController");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Assets");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
router.get("/admin/reported-listings", getReportedListings);
router.post("/reportUser", upload.single("image"), reportUser);
router.get("/admin/reported-users", getReportedUsers);

module.exports = router;
