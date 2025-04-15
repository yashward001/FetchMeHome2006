import React from "react";
import { Route } from "react-router-dom";
import AdminNavBar from "../Components/AdminPanel/AdminNavBar";
import AdminScreen from "../Components/AdminPanel/AdminScreen";
import Footer from "../Components/Footer/Footer";

const AdminPanel = () => {
  return (
    <div>
      <AdminNavBar />
      <AdminScreen />
      <Footer />
    </div>
  );
};

const AdminPanelRoute = (
  <Route path="/adminpanel" element={<AdminPanel />} />
);

export default AdminPanelRoute;
