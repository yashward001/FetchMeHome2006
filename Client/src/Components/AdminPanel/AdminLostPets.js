import React from "react";
import LostPets from "../Find/LostPets";  // Adjust the import path according to your project structure
import AdminLostPetsViewer from "./AdminLostPetsViewer";

const AdminLostPets = () => {
  return <LostPets viewerComponent={AdminLostPetsViewer} />;
};

export default AdminLostPets;
