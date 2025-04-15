import React from "react";
import { Route } from "react-router-dom";
import Layout from "./Layout";
import LostPets from "../Components/Find/LostPets";

const LostPetRoutes = (
    <Route 
      path="/find" 
      element={
        <Layout>
          <LostPets />
        </Layout>
      } 
    />
);

export default LostPetRoutes;
