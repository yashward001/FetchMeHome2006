import React from "react";
import { Route } from "react-router-dom";
import Register from "../Components/Auth/Register";

const RegisterRoutes = (
    <Route path="/register" element={<Register />} />
);

export default RegisterRoutes;
