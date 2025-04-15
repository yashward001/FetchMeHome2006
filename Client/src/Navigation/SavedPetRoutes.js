import React from "react";
import { Route } from "react-router-dom";
import Layout from "./Layout";
import SavedPets from "../Components/UserPanel/SavedPets";

const SavedPetRoutes = (
    <Route 
      path="/saved" 
      element={
        <Layout>
          <SavedPets />
        </Layout>
      } 
    />
);

export default SavedPetRoutes;
