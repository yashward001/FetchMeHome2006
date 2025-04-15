import React from "react";
import { Route } from "react-router-dom";
import AdminLogin from "../Components/AdminPanel/AdminLogin";

const AdminRoutes = (
    <Route path="/admin" element={<AdminLogin />} />
);

export default AdminRoutes;
