import React from "react";
import { Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "../Components/Home/Home";

const HomeRoutes = (
    <Route 
      path="/" 
      element={
        <Layout>
          <Home description="Ensure you are fully prepared to provide proper care and attention to your pet before welcoming them into your home." />
        </Layout>
      } 
    />
);

export default HomeRoutes;
