const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {  
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
  myLostPets } = require('../Controller/LostPetController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../Assets')); // Ensure Lost Pet images are saved in the same directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/lostPets', upload.single('picture'), postLostPetRequest);

router.get('/lostPets', allLostPets);

router.post('/uploadImage', upload.single('picture'), uploadImageForPet);

router.get("/myLostPets/:userId", myLostPets)

router.patch("/updateLostPet/:petId", updateLostPet)

router.post("/reportFoundPet", upload.single("image"), reportFoundPet)

router.post("/reportLostPet/:petId", reportLostPet)

router.delete("/deleteLostPet/:petId", deleteLostPet)

router.delete("/admin/deleteLost/:petId", deleteLost)

router.get("/myLostPetRequests/:userId", myLostPetRequests)

router.delete("/deleteLostPetRequest/:requestId", deleteLostPetRequest)

router.put("/acceptLostPetRequest/:requestId", acceptLostPetRequest)

router.get("/mySubmittedRequests/:finderId", mySubmittedRequests)

router.get('/requests', (req, res) => allLostPets('Pending', req, res));

router.get('/approvedLostPets', (req, res) => allLostPets('Approved', req, res));

router.get('/foundPets', (req, res) => allLostPets('Found', req, res));

router.post('/report', upload.single('picture'), postLostPetRequest);

router.put('/approving/:id', approveLostPetRequest);

router.delete('/delete/:id', deleteLostPetPost);

module.exports = router;
