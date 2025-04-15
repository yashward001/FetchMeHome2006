const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean, 
    default: false, // Default is false
  },
  profileImage: {
    type: String,
    default: ""
  },
  banned: { 
    type: Boolean, default: false 
  },
  savedPets: [
    {
      name: String,
      species: String,
      temperament: String,
      life_span: String,
      image: String
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
