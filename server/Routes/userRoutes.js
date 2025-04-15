const express = require("express");
const multer = require("multer");
const auth = require("../Middleware/authMiddleware");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateUserProfile,
  uploadProfileImage,
  savePet,
  getSavedPets
} = require("../Controller/UserController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "Assets/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", auth, updateUserProfile);
router.put("/upload-image", auth, upload.single("profileImage"), uploadProfileImage);
router.post("/save-pet", auth, savePet);
router.get("/saved-pets", auth, getSavedPets);

module.exports = router;
