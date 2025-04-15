const Pet = require('../Model/PetModel');
const AdoptForm = require('../Model/AdoptFormModel');
const Report = require("../Model/ReportModel");
const mongoose = require('mongoose');

const postPetRequest = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded!" });
    }
    const { name, age, area, justification, email, phone, type, userId  } = req.body;
    const { filename } = req.file;

    if (!name || !age || !area || !email || !phone || !type || !filename) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const pet = await Pet.create({
      name,
      age,
      area,
      justification,
      email,
      phone,
      type,
      filename,
      postedBy: userId, // Store the user ID
      status: 'Pending'
    });

    res.status(200).json(pet);
  } catch (error) {
    console.error("Error saving pet:", error);
    res.status(500).json({ error: error.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const id = req.params.id;

    const adoptionRequest = await AdoptForm.findById(requestId);
    if (!adoptionRequest) {
      return res.status(404).json({ error: 'Adoption request not found' });
    }

    const pet = await Pet.findById(adoptionRequest.petId);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Update pet to be "Adopted" and set the new owner's details
    pet.status = "Adopted";
    await pet.save();

    res.status(200).json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleAdoptionRequest = async (req, res) => {
  try {
    const {requestId, action } = req.body; // action = "Approve" or "Reject"

    const adoptionRequest = await AdoptForm.findById(requestId).populate("petId");
    if (!adoptionRequest) {
      return res.status(404).json({ error: "Adoption request not found" });
    }

    console.log(" Adoption request found:", adoptionRequest);

    adoptionRequest.status = action === "Approve" ? "Approved" : "Rejected";
    await adoptionRequest.save();

    // If approved, mark the pet as "Adopted"
    if (action === "Approve") {
      const pet = await Pet.findById(adoptionRequest.petId);
      if (pet) {
        pet.status = "Adopted"; //  Mark pet as Adopted
        await pet.save();
        // console.log(" Pet status updated to Adopted.");
      }
    }

    if (action === "Reject") {
      //  Remove the adoption request if rejected
      await AdoptForm.findByIdAndDelete(requestId);

      return res.status(200).json({ message: "Request rejected and removed successfully" });
    }


    res.status(200).json({ message: `Request ${action.toLowerCase()}d successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const allPets = async (req, res) => {
  try {
    const data = await Pet.find().sort({ updatedAt: -1 }); // Get ALL pets, no filtering
    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "No data found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const requestAdoption = async (req, res) => {
  try {
   
    const { petId, userId, email, phoneNo, livingSituation, previousExperience, familyComposition } = req.body;
    
      if (!petId || !userId) {
      return res.status(400).json({ error: "Pet ID and User ID are required" });
    }

    const pet = await Pet.findById(petId).populate("postedBy", "_id name email");;
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    console.log("Pet found:", pet);


    const adoptionRequest = await AdoptForm.create({
      petId,
      adopterId: userId, 
      ownerId: pet.postedBy._id, 
      email, 
      phoneNo, 
      livingSituation, 
      previousExperience, 
      familyComposition,
      status: "Pending"
    });
    console.log("hi");
    console.log(" Adoption request created:", adoptionRequest);

    res.status(200).json({ message: "Adoption request submitted successfully", adoptionRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const getAdoptionRequests = async (req, res) => {
  try {
    const { ownerId } = req.params; //  Logged-in owner ID

    console.log("Fetching adoption requests for Owner ID:", ownerId);

    if (!ownerId) {
      return res.status(400).json({ error: "Owner ID is required" });
    }

    const adoptionRequests = await AdoptForm.find({ownerId})
      .populate("adopterId", "name email") //  Fetch adopter details
      .populate("petId", "name type"); //  Fetch pet details

      console.log("Found adoption requests:", adoptionRequests);

    if (adoptionRequests.length === 0) {
      return res.status(404).json({ error: "No adoption requests found for this user" });
    }

    res.status(200).json(adoptionRequests);
  } catch (err) {
    console.error("Error fetching adoption requests:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const updatePet = async (req, res) => {
  try {
    const { id } = req.params; 
    // Get pet ID from URL
    console.log("Received request to update pet with ID:", id);
    const updatedData = req.body;
    // Get updated pet data from request body
    console.log("Data received in request body:", updatedData); 
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(" Invalid pet ID format");
      return res.status(400).json({ message: 'Invalid pet ID' });
  }

    const updatedPet = await Pet.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedPet) {
      console.log("Pet not found in database");
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.status(200).json(updatedPet); // Send updated pet data
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ message: 'Failed to update pet' });
  }
}

const report = async (req, res) => {
  try {
    const { petId } = req.params;
    const { reason } = req.body;

    // Check if the pet exists
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    console.log(" Pet found:", pet);
    // Check if the pet is already reported
    const existingReport = await Report.findOne({ petId });
    if (existingReport) {
      console.log(" This listing has already been reported.");
      return res.status(400).json({ error: "This listing has already been reported." });
    }

    //  Save the full listing details in the report
    const report = new Report({
      petId,
      name: pet.name,
      type: pet.type,
      age: pet.age,
      area: pet.area,
      justification: pet.justification,
      filename: pet.filename,
      email: pet.email,
      phone: pet.phone,
      reason,
    });

    await report.save();

    res.status(200).json({ message: "Report submitted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
}

const adoptedHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(" Fetching adopted pets for Adopter ID:", userId);

    // Find all adoption requests where the user was the adopter and the request was approved
    const adoptedPets = await AdoptForm.find({ adopterId: userId, status: "Approved" })
      .populate("petId"); // Fetch pet details

    console.log(" Found adopted pets:", adoptedPets);
    res.status(200).json(adoptedPets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const myPets = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(" Fetching all pets posted by Owner ID:", userId);

    //  Fetch all pets where the logged-in user is the owner
    const userPets = await Pet.find({ postedBy: userId });

    console.log(" Found user pets:", userPets);
    res.status(200).json(userPets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteP = async (req, res) => {
  try {
    const { petId } = req.params;
    const userId = req.query.userId;
    
    if (!petId) {
      return res.status(400).json({ error: "Missing pet ID" });
    }
    
    if (!userId) {
      console.log("Missing user ID");
      return res.status(400).json({ error: "Missing user ID" });
    }
    
    const pet = await Pet.findById(petId);
    if (!pet) {
      console.log("Pet not found in database");
      return res.status(404).json({ error: "Pet not found" });
    }
    
    if (pet.postedBy.toString() !== userId) {
      console.log(`Unauthorized: User ${userId} does not match ${pet.postedBy.toString()}`);
      return res.status(403).json({ error: "Unauthorized action" });
    }
    
    await Pet.findByIdAndDelete(petId);
    console.log("Pet deleted successfully by owner!");
    return res.status(200).json({ message: "Pet deleted successfully" });
    
  } catch (error) {
    console.error("ERROR deleting pet:", error);
    return res.status(500).json({ error: error.message });
  }
}

const approvedPets = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching approved pets for Owner ID:", userId);

    const approvedPets = await Pet.find({ postedBy: userId, status: "Adopted" });
    console.log("Found approved pets:", approvedPets);
    res.status(200).json(approvedPets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const admindeleteP = async (req, res) => {
  try {
    const { petId } = req.params;
    if (!petId) {
      return res.status(400).json({ error: "Missing pet ID" });
    }
    
    const pet = await Pet.findById(petId);
    if (!pet) {
      console.log("Pet not found in database");
      return res.status(404).json({ error: "Pet not found" });
    }
    
    await Pet.findByIdAndDelete(petId);
    console.log("Pet deleted successfully by admin");

    const deletedReports = await Report.deleteMany({ petId: new mongoose.Types.ObjectId(petId) });
    console.log("Reports deleted:", deletedReports.deletedCount);

    return res.status(200).json({ 
      message: "Pet deleted and related reports deleted successfully" 
    });

  } catch (error) {
    console.error("ERROR deleting pet:", error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  postPetRequest,
  approveRequest,
  allPets,
  requestAdoption,
  getAdoptionRequests,
  handleAdoptionRequest,
  updatePet,
  report,
  adoptedHistory,
  myPets,
  deleteP,
  approvedPets,
  admindeleteP
};
