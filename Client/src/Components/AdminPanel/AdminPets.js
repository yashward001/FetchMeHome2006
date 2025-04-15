import React from "react";
import Pets from "../Pets/Pets"; // Import your existing Pets.js
import AdminPetsViewer from "./AdminPetsViewer"; // Import the admin viewer

const AdminPets = () => {
  return <Pets viewerComponent={AdminPetsViewer} />;
};

export default AdminPets;
