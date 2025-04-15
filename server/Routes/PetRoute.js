const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { 
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
  admindeleteP } = require('../Controller/PetController');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../Assets'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get("/adoptedPets", allPets); 

router.get("/approvedPets/:userId", approvedPets)

router.put('/approving/:id', approveRequest);

router.delete("/admindeleteP/:petId", admindeleteP)

router.delete("/deleteP/:petId", deleteP)

router.post('/services', upload.single('picture'), postPetRequest);

router.post('/adoption-request', requestAdoption); // Users request to adopt

router.get('/adoption-requests/:ownerId', getAdoptionRequests); // Owners fetch adoption requests

router.patch('/handle-adoption', handleAdoptionRequest);

router.get("/myPets/:userId", myPets)

router.get("/adoptedHistory/:userId", adoptedHistory)

router.post("/report/:petId", report)

router.patch('/updatePet/:id', updatePet)



module.exports = router;
