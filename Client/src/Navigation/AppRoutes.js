import React from "react";
import { Routes } from "react-router-dom";
import HomeRoutes from "./HomeRoutes";
import ServiceRoutes from "./ServiceRoutes";
import FAQRoutes from "./FAQRoutes";
import PetRoutes from "./PetRoutes";
import AdoptFormRoutes from "./AdoptFormRoutes";
import AdminRoutes from "./AdminRoutes";
import RegisterRoutes from "./RegisterRoutes";
import LoginRoutes from "./LoginRoutes";
import LostPetRoutes from "./LostPetRoutes";
import PanelRoutes from "./PanelRoutes";
import PersonalityRoutes from "./PersonalityRoutes";
import ProfileRoutes from "./ProfileRoutes";
import SavedPetRoutes from "./SavedPetRoutes"


const AppRoutes = () => {
  return (
    <Routes>
      {LoginRoutes}
      {RegisterRoutes} 
      {PanelRoutes} 
      {HomeRoutes} 
      {ServiceRoutes}
      {LostPetRoutes}
      {FAQRoutes}
      {PetRoutes}
      {AdoptFormRoutes}
      {AdminRoutes}
      {PersonalityRoutes}
      {ProfileRoutes}
      {SavedPetRoutes}
    </Routes>
  );
};

export default AppRoutes;
