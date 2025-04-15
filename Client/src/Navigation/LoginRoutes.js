import React from "react";
import { Route } from "react-router-dom";
import Login from "../Components/Auth/Login";

const LoginRoutes = (
    <Route path="/login" element={<Login />} />
);

export default LoginRoutes;
