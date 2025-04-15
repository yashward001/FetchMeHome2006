import React from "react";
import AdminNavBar from "./AdminNavBar";
import AdminPets from "./AdminPets";  // Imports the component that uses the admin viewer for pets
import Footer from "../Footer/Footer";

const AdminPetPage = () => {
  return (
    <div>
      <AdminNavBar />
      <AdminPets />
      <Footer />
    </div>
  );
};

export default AdminPetPage;
