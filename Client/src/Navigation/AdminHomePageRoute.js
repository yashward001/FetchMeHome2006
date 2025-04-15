import React from "react";
import { Route } from "react-router-dom";
import AdminHomePage from "../Components/AdminPanel/AdminHomePage";

const AdminHomePageRoute = (
  <Route path="/adminhome" element={<AdminHomePage />} />
);

export default AdminHomePageRoute;
