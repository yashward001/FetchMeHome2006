import React from "react";
import { Route } from "react-router-dom";
import Layout from "./Layout";
import Profile from "../Components/UserPanel/UserProfile";

const ProfileRoutes = (
    <Route 
      path="/profile" 
      element={
        <Layout>
          <Profile />
        </Layout>
      } 
    />
);

export default ProfileRoutes;
