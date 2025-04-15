import React from "react";
import { Route } from "react-router-dom";
import Layout from "./Layout";
import Pets from "../Components/Pets/Pets";

const PetRoutes = (
    <Route 
      path="/pets" 
      element={
        <Layout>
          <Pets />
        </Layout>
      } 
    />
);

export default PetRoutes;
