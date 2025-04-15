  const User = require("../Model/User");
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const mongoose = require("mongoose");

  // Initialise the Models
  const Report = require("../Model/ReportModel");
  const ReportUser = require("../Model/ReportUserModel");
  const Pet = require("../Model/PetModel");
  const LostPet = require("../Model/LostPetModel");
  const AdoptRequest = require("../Model/AdoptFormModel");
  const LostRequest = require("../Model/LostPetRequestModel");
  const AdoptForm = require("../Model/AdoptFormModel");
  const LostPetReport = require("../Model/LostPetReportModel");
  const LostPetRequests = require("../Model/LostPetRequestModel");


  // Admin Login Controller
  const adminLogin = async (req, res) => {
      try {
        const { email, password } = req.body;
        // Find a user with the provided email and isAdmin flag set to true
        const admin = await User.findOne({ email, isAdmin: true });
        if (!admin) {
          return res.status(400).json({ msg: "Invalid Email or Password!" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return res.status(400).json({ msg: "Invalid Email or Password!" });
        }
        const token = jwt.sign({ id: admin._id }, "secret", { expiresIn: "7d" });
        res.json({ token, user: { _id: admin._id, name: admin.name, email: admin.email, isAdmin: admin.isAdmin } });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  };  

  // Existing getCredentials function (optional, for retrieving admin details)
  const getCredentials = async (req, res) => {
    try {
      // Query for a user with the isAdmin flag set to true
      const admin = await User.findOne({ isAdmin: true });
      if (!admin) {
        return res.status(404).json({ msg: "Admin not found. Please register an admin user." });
      }

      // Return selected admin fields
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const deleteListing = async (req, res) => {
    try {
      const { petId } = req.params;
      console.log("Admin deleting adoption listing for pet ID:", petId);
  
      if (!petId) {
        return res.status(400).json({ error: "Missing pet ID" });
      }
  
      // Find the pet
      const pet = await Pet.findById(petId);
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }
  
      // Find the associated report
      const report = await Report.findOne({ petId: new mongoose.Types.ObjectId(petId) });
      if (!report) {
        return res.status(404).json({ error: "Associated report not found" });
      }
  
      // Step 1: Delete all adoption requests for this pet
      const deletedAdoptListingRequest = await AdoptForm.deleteMany({ petId: new mongoose.Types.ObjectId(petId) });
      console.log(`Deleted ${deletedAdoptListingRequest.deletedCount} adoption requests.`);

      // Step 2: Delete the pet itself
      await Pet.findByIdAndDelete(petId);
      console.log("Pet deleted:", petId);
  
      // Step 3: Delete the report
      await Report.findByIdAndDelete(report._id);
      console.log("Report deleted:", report._id);
  
      return res.status(200).json({ message: "Adoption listing, associated requests, and report deleted successfully." });
    } catch (error) {
      console.error("Error deleting adoption listing:", error);
      return res.status(500).json({ error: error.message });
    }
  };
  
  const dismissListingReport = async (req, res) => {
    try {
      const { petId } = req.params;
      console.log("Admin dismissing report for petId:", petId);

      if (!petId) {
        return res.status(400).json({ error: "Missing pet ID" });
      }

      const report = await Report.findOne({ petId: new mongoose.Types.ObjectId(petId) });
      console.log("Found report:", report);

      if (!report) {
        return res.status(404).json({ error: "Report not found for this pet" });
      }

      await Report.findByIdAndDelete(report._id);
      res.status(200).json({ message: "Report dismissed successfully" });
    } catch (error) {
      console.error("Error dismissing listing report:", error);
      res.status(500).json({ error: error.message });
    }
  };

  const banUser = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) return res.status(400).json({ error: "Missing user ID" });

      let result = {
        userBanned: false,
        reportUpdated: false,
        reportsDeleted: false,
        adoptionListingsDeleted: false,
        lostPetListingsDeleted: false,
        adoptRequestDeleted: false,
        lostRequestDeleted: false
      };

      // 1. Ban the user
      const updatedUser = await User.findByIdAndUpdate(id, { banned: true }, { new: true });
      if (updatedUser) {
        result.userBanned = true;
      }

      // 2. Update report status
      const updatedReport = await ReportUser.findOneAndUpdate(
        { finderId: id },
        { status: "Banned" },
        { new: true }
      );
      if (updatedReport) {
        result.reportUpdated = true;
        await ReportUser.deleteMany({ finderId: id });
        result.reportsDeleted = true;
      }

      // 3. Delete adoption listings
      const petDelete = await Pet.deleteMany({ postedBy: id });
      if (petDelete.deletedCount > 0) {
        result.adoptionListingsDeleted = true;
      }

      // 4. Delete lost pet listings
      const lostPetDelete = await LostPet.deleteMany({ reportedBy: id });
      if (lostPetDelete.deletedCount > 0) {
        result.lostPetListingsDeleted = true;
      }

      // 5. Delete adoption requests
      const adoptRequestDelete = await AdoptRequest.deleteMany({ adopterId: id });
      if (adoptRequestDelete.deletedCount > 0) {
        result.adoptRequestDeleted = true;
      }

      // 6. Delete lost pet requests
      const LostRequestDelete = await LostRequest.deleteMany({ finderId: id });
      if (lostPetDelete.deletedCount > 0) {
        result.lostRequestDeleted = true;
      }

      // Final response
      if (!result.userBanned && !result.reportUpdated) {
        return res.status(404).json({ error: "User not found in system or no reports available" });
      }

      return res.status(200).json({
        message: "User banned and all associated listings/reports removed.",
        details: result,
      });

    } catch (error) {
      console.error("Error banning user:", error);
      res.status(500).json({ error: error.message });
    }
  };

  const dismissUserReport = async (req, res) => {
    try {
      const { finderId } = req.params;
      console.log("Admin dismissing report for finderId:", finderId);

      if (!finderId) {
        return res.status(400).json({ error: "Missing finder ID" });
      }

      const report = await ReportUser.findOne({ finderId: new mongoose.Types.ObjectId(finderId) });
      console.log("Found report:", report);

      if (!report) {
        return res.status(404).json({ error: "Report not found for this user" });
      }

      await ReportUser.deleteMany({ finderId: new mongoose.Types.ObjectId(finderId) });
      res.status(200).json({ message: "User report dismissed successfully" });
    } catch (error) {
      console.error("Error dismissing user report:", error);
      res.status(500).json({ error: error.message });
    }
  };

  const deleteLostPetListing = async (req, res) => {
    try {
      const { petId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(petId)) {
        return res.status(400).json({ error: "Invalid pet ID format." });
      }
  
      const pet = await LostPet.findById(petId);
      if (!pet) {
        return res.status(404).json({ error: "Lost pet listing not found." });
      }
  
      const report = await LostPetReport.findOne({ petId: new mongoose.Types.ObjectId(petId) });
      if (!report) {
        return res.status(404).json({ error: "Lost pet report not found for this listing." });
      }

      // Delete the lost pet post
      await LostPet.findByIdAndDelete(petId);

      // Delete requests associated to the lost pet post
      const deletedLostListingRequest = await LostPetRequests.deleteMany({ petId: new mongoose.Types.ObjectId(petId) });
      console.log(`Deleted ${deletedLostListingRequest.deletedCount} adoption requests.`);

      // Delete the lost pet report
      await LostPetReport.findByIdAndDelete(report._id);
  
      return res.status(200).json({ message: "Lost pet listing and all its report deleted successfully." });
    } catch (err) {
      console.error("Error deleting lost pet listing:", err);
      res.status(500).json({ error: err.message });
    }
  };

  const deleteLostPetReport = async (req, res) => {
    try {
      const { petId } = req.params;
  
      const report = await LostPetReport.findOne({ petId });
      if (!report) {
        return res.status(404).json({ error: "Lost pet report not found for this listing." });
      }
  
      await LostPetReport.findByIdAndDelete(report._id);
      return res.status(200).json({ message: "Lost pet report dismissed successfully." });
    } catch (err) {
      console.error("Error dismissing lost pet report:", err);
      res.status(500).json({ error: err.message });
    }
  };


  module.exports = { 
    adminLogin, 
    getCredentials,
    deleteListing,
    dismissListingReport,
    banUser,
    dismissUserReport,
    deleteLostPetListing,
    deleteLostPetReport
  };
