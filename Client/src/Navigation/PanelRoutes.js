import React from "react";
import { Route } from "react-router-dom";
import Layout from "./Layout";
import UserPanel from "../Components/UserPanel/UserPanel"; 

const PanelRoutes = (
    <Route 
      path="/mypanel" 
      element={
        <Layout>
          <UserPanel />
        </Layout>
      } 
    />
);

export default PanelRoutes;
