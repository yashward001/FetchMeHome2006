import React from "react";
import { Route } from "react-router-dom";
import AdminPetPage from "../Components/AdminPanel/AdminPetPage";

const AdminPetRoute = (
  <Route path="/adminpets" element={<AdminPetPage />} />
);

export default AdminPetRoute;
