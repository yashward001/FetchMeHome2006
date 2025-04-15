import React from "react";
import { Route } from "react-router-dom";
import Layout from "./Layout";
import Services from "../Components/Services/Services";

const ServiceRoutes = (
    <Route 
      path="/services" 
      element={
        <Layout>
          <Services />
        </Layout>
      } 
    />
);

export default ServiceRoutes;
