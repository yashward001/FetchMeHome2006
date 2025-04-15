const express = require('express');
const router = express.Router();
const AdoptForm = require("../Model/AdoptFormModel");
const {
  saveForm,
  getForms,
  mySubmittedAdoptionRequests,
  deleteForm,
  deleteAllRequests,
  getAdoptForms,
  handleAdoptionRequest
} = require('../Controller/AdoptFormController');

router.post('/save', saveForm);
router.get('/getForms/:userId', getForms);
router.get("/mySubmittedAdoptionRequests/:adopterId", mySubmittedAdoptionRequests);
router.delete('/reject/:id', deleteForm);
router.delete('/delete/many/:id', deleteAllRequests);
router.get('/requests/:userId', getAdoptForms); // Fetch requests only for the pet owner
router.put('/handle/:userId', handleAdoptionRequest); // Approve/reject adoption request

module.exports = router;
