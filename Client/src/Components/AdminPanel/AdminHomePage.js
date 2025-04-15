import React from "react";
import CardBelowHome from "../Home/CardBelowHome";
import PlanningToAdoptAPet from "../Home/PlanningToAdoptAPet";
import "../../Styles/Home.css"
import AdminHomeLandingContainer from "./AdminHomeLandingContainer";
import AdminNavBar from "./AdminNavBar";

const AdminHomePage = (props) => {
  return (
    <>
      <AdminNavBar />
      <AdminHomeLandingContainer description={props.description} />
      <CardBelowHome />
      <PlanningToAdoptAPet />
    </>
  );
};

export default AdminHomePage;
