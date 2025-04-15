import React from "react";
import { Route } from "react-router-dom";
import Layout from "./Layout";
import FAQ from "../Components/Contact/FAQ";

const FAQRoutes = (
    <Route 
      path="/faq" 
      element={
        <Layout>
          <FAQ />
        </Layout>
      } 
    />
);

export default FAQRoutes;
