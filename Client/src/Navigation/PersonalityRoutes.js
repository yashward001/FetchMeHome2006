import React from "react";
import { Route } from "react-router-dom";
import Layout from "./Layout";
import Personality from "../Components/PersonalityTest/Personality";

const PersonalityRoutes = (
    <Route 
      path="/personality" 
      element={
        <Layout>
          <Personality />
        </Layout>
      } 
    />
);

export default PersonalityRoutes;
