import React from "react";
import AdminNavBar from "./AdminNavBar";
import AdminLostPets from "./AdminLostPets";  
import Footer from "../Footer/Footer";

const AdminLostPetPage = () => {
  return (
    <div>
      <AdminNavBar />
      <AdminLostPets />
      <Footer />
    </div>
  );
};

export default AdminLostPetPage;
