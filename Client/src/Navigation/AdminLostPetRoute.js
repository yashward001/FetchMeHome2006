import React from "react";
import { Route } from "react-router-dom";
import AdminLostPetPage from "../Components/AdminPanel/AdminLostPetPage";

const AdminLostPetRoute = (
  <Route path="/adminfind" element={<AdminLostPetPage />} />
);

export default AdminLostPetRoute;
