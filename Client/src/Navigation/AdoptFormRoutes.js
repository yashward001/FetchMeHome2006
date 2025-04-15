import React from "react";
import { Route } from "react-router-dom";
import Layout from "./Layout";
import AdoptForm from "../Components/AdoptForm/AdoptForm";

const AdoptFormRoutes = (
    <Route 
      path="/adopt-form" 
      element={
        <Layout>
          <AdoptForm />
        </Layout>
      } 
    />
);

export default AdoptFormRoutes;
