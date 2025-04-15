const LostPet = require('../Model/LostPetModel');
const LostPetReport = require('../Model/LostPetReportModel');
const LostPetRequest = require('../Model/LostPetRequestModel');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const postLostPetRequest = async (req, res) => {
  try {
    // Check if a file (picture) was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded!" });
    }

    // Extract fields from the request body
    const { name, petAge, lastSeenLocation, description, email, phone, type, userId } = req.body;
    const { filename } = req.file; 

    // Validate required fields
    if (!name || !petAge || !lastSeenLocation || !description || !email || !phone || !type || !filename) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID (reportedBy) is required" });
    }

    // Create lost pet listing in the database
    const lostPet = await LostPet.create({
      name,
      petAge,
      lastSeenLocation,
      description,
      email,
      phone,
      type,
      filename,
      reportedBy: userId, 
      status: 'Missing'
    });

    res.status(200).json(lostPet);
  } catch (error) {
    console.error("Error saving lost pet:", error);
    res.status(500).json({ error: error.message });
  }
};

const allLostPets = async (req, res) => {
  try {
    const data = await LostPet.find().sort({ createdAt: -1 }); 
    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "No lost pets found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadImageForPet = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded!" });
    }
    
    const { petId, userId } = req.body;
    const { filename } = req.file;
    
    // Validate required fields
    if (!petId || !userId || !filename) {
      return res.status(400).json({ error: "Missing required fields!" });
    }
    
    res.status(200).json({ message: "Image uploaded successfully", filename });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: error.message });
  }
};

const approveLostPetRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const { email, phone, status } = req.body;
    const lostPet = await LostPet.findByIdAndUpdate(id, { email, phone, status }, { new: true });

    if (!lostPet) {
      return res.status(404).json({ error: 'Lost pet not found' });
    }

    res.status(200).json(lostPet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteLostPetPost = async (req, res) => {
  try {
    const id = req.params.id;
    const lostPet = await LostPet.findByIdAndDelete(id);
    if (!lostPet) {
      return res.status(404).json({ error: 'Lost pet not found' });
    }
    const filePath = path.join(__dirname, '../Assets', lostPet.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(200).json({ message: 'Lost pet post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const mySubmittedRequests = async (req, res) => {
  try {
    const { finderId } = req.params;

    if (!finderId) {
      return res.status(400).json({ error: "Finder ID is required" });
    }

    // Fetch submitted requests for the logged-in finder
    const submittedRequests = await LostPetRequest.find({ finderId })
      .populate({
        path: "petId",
        select: "name type", 
      })
      .sort({ createdAt: -1 });

    console.log("Finder's Submitted Requests:", submittedRequests);
    res.status(200).json(submittedRequests);
  } catch (error) {
    console.error("Error fetching submitted requests:", error);
    res.status(500).json({ error: "Failed to fetch submitted requests" });
  }
}

const acceptLostPetRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Find the request
    const request = await LostPetRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Update request status to "accepted"
    request.status = "Accepted";
    await request.save();

    const lostPet = await LostPet.findByIdAndUpdate(
      request.petId, 
      { status: "Found" }, 
      { new: true }
    );

    if (!lostPet) {
      return res.status(404).json({ error: "Lost Pet not found" });
    }

    console.log("Request Accepted and Lost Pet Listing Deleted:", request);

    res.status(200).json({ message: "Request accepted, lost pet listing deleted", updatedRequest: request });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ error: "Failed to accept request" });
  }
}

const deleteLostPetRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const deletedRequest = await LostPetRequest.findByIdAndDelete(requestId);
    if (!deletedRequest) {
      return res.status(404).json({ error: "Request not found." });
    }

    res.status(200).json({ message: "Lost pet request deleted successfully." });
  } catch (error) {
    console.error("Error deleting lost pet request:", error);
    res.status(500).json({ error: "Failed to delete request." });
  }
}

const myLostPetRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    // Filter only lost pets that belong to the logged-in user
    const reports = await LostPetRequest.find()
      .populate({
        path: "petId",
        select: "reportedBy name type",
      })
      .populate("finderId", "email phone") 
      .sort({ createdAt: -1 });

    console.log("Fetched Reports:", reports);

    // Filter only lost pets that belong to the logged-in user
    const userReports = reports.filter(report => report.petId?.reportedBy?.toString() === userId);

    res.status(200).json(userReports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
}

const deleteLost = async (req, res) => {
  try {
    const { petId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
      return res.status(400).json({ error: "Invalid pet ID format." });
    }

    const lostPet = await LostPet.findById(petId);
    if (!lostPet) {
      console.log("Lost pet not found in database for ID:", petId);
      return res.status(404).json({ error: "Lost pet not found." });
    }

    // Delete the lost pet
    await LostPet.findByIdAndDelete(petId);
    console.log("Lost pet deleted successfully by admin.");

    // Delete related reports
    const deletedReports = await LostPetReport.deleteMany({ petId: new mongoose.Types.ObjectId(petId) });
    console.log("Lost pet reports deleted:", deletedReports.deletedCount);

    res.status(200).json({ 
      message: "Lost pet and related reports deleted successfully." 
    });

  } catch (error) {
    console.error("Admin failed to delete lost pet listing:", error);
    res.status(500).json({ error: "Admin failed to delete lost pet listing." });
  }
}

const deleteLostPet = async (req, res) => {
  try {
    const { petId } = req.params;
    const { userId } = req.body; 

    // Find the lost pet
    const lostPet = await LostPet.findById(petId);
    if (!lostPet) {
      return res.status(404).json({ error: "Lost pet not found." });
    }

    // Check if the user making the request is the original reporter
    if (lostPet.reportedBy.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized: You can only delete your own reports." });
    }

    await lostPet.deleteOne();

    res.status(200).json({ message: "Lost pet report deleted successfully." });
  } catch (error) {
    console.error("Error deleting lost pet:", error);
    res.status(500).json({ error: "Failed to delete lost pet report." });
  }
}

const reportLostPet = async (req, res) => {
  try {
    const { petId } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: "Reason is required." });
    }

    // Check if lost pet exists
    const lostPet = await LostPet.findById(petId);
    if (!lostPet) {
      return res.status(404).json({ error: "Lost pet not found." });
    }

    // Check if report already exists
    const existingReport = await LostPetReport.findOne({ petId });
    if (existingReport) {
      return res.status(400).json({ error: "This lost pet listing has already been reported." });
    }

    // Create the report with full lost pet info
    const report = new LostPetReport({
      petId: lostPet._id,
      name: lostPet.name,
      type: lostPet.type,
      petAge: lostPet.petAge,
      lastSeenLocation: lostPet.lastSeenLocation,
      description: lostPet.description,
      filename: lostPet.filename,
      email: lostPet.email,
      phone: lostPet.phone,
      reason
    });

    await report.save();

    res.status(200).json({ message: "Lost pet listing reported successfully." });
  } catch (err) {
    console.error("Error reporting lost pet:", err);
    res.status(500).json({ error: "Could not report lost pet listing." });
  }
}

const reportFoundPet = async (req, res) => {
  try {
    const { petId, finderId, finderEmail, finderPhone } = req.body;

    if (!petId || !finderId || !finderEmail || !finderPhone || !req.file) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRequest = new LostPetRequest({
      petId,
      finderId,
      finderEmail,
      finderPhone,
      image: req.file.filename,
      status: "Pending"
    });

    await newRequest.save();
    res.status(201).json({ message: "Report sent to pet owner!" });
  } catch (error) {
    console.error("Error reporting found pet:", error);
    res.status(500).json({ error: "Failed to report found pet" });
  }
}

const updateLostPet = async (req, res) => {
  try {
    const { petId } = req.params;
    const { userId, name, type, petAge, lastSeenLocation, email, phone, description } = req.body;

    console.log("Received Update Request for Pet ID:", petId);
    console.log("Request Body:", req.body);

    if (!userId) {
      console.error("Error: Missing userId in request body");
      return res.status(400).json({ error: "User ID is required" });
    }

    // Find the lost pet
    const lostPet = await LostPet.findById(petId);
    if (!lostPet) {
      return res.status(404).json({ error: "Lost pet not found." });
    }

    // Check if the user making the request is the original reporter
    if (lostPet.reportedBy.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized: You can only edit your own reports." });
    }

    // Update the pet details
    lostPet.name = name || lostPet.name;
    lostPet.type = type || lostPet.type;
    lostPet.petAge = petAge || lostPet.petAge;
    lostPet.lastSeenLocation = lastSeenLocation || lostPet.lastSeenLocation;
    lostPet.email = email || lostPet.email;
    lostPet.phone = phone || lostPet.phone;
    lostPet.description = description || lostPet.description;

    await lostPet.save();
    console.log("Pet updated successfully:", lostPet);

    res.status(200).json({ message: "Lost pet updated successfully.", lostPet });
  } catch (error) {
    console.error("Error updating lost pet:", error);
    res.status(500).json({ error: "Failed to update lost pet report." });
  }
}

const myLostPets = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const lostPets = await LostPet.find({ reportedBy: userId }).sort({ createdAt: -1 });

    if (!lostPets.length) {
      return res.status(404).json({ message: "No lost pets found for this user." });
    }

    res.status(200).json(lostPets);
  } catch (error) {
    console.error("Error fetching lost pets:", error);
    res.status(500).json({ error: "Failed to fetch lost pets." });
  }
}


module.exports = {
  postLostPetRequest,
  approveLostPetRequest,
  deleteLostPetPost,
  allLostPets,
  uploadImageForPet,
  mySubmittedRequests,
  acceptLostPetRequest,
  deleteLostPetRequest,
  myLostPetRequests,
  deleteLost,
  deleteLostPet,
  reportLostPet,
  reportFoundPet,
  updateLostPet,
  myLostPets,
  uploadImageForPet,
  allLostPets
};

