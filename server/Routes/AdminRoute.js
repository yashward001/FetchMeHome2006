const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const { 
    adminLogin, 
    getCredentials, 
    deleteListing, 
    dismissListingReport, 
    banUser, 
    dismissUserReport, 
    deleteLostPetListing, 
    deleteLostPetReport} = require('../Controller/AdminController');

// Admin login endpoint
router.post('/login', adminLogin);
router.get('/credentials', getCredentials);
router.delete("/deleteListing/:petId", deleteListing);
router.delete("/dismissListingReport/:petId", dismissListingReport);
router.patch("/banUser/:id", banUser);
router.delete("/dismissUserReport/:finderId", dismissUserReport);
router.delete("/deleteLostPetListing/:petId", deleteLostPetListing);
router.delete("/dismissLostPetReport/:petId", deleteLostPetReport);
  
module.exports = router;
