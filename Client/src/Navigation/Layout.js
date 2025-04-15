import React from "react";
import Navbar from "../Components/NavBar/Navbar";
import Footer from "../Components/Footer/Footer";

const Layout = ({ children }) => (
  <>
    <Navbar title="FetchMeHome" />
    {children}
    <Footer title="FetchMeHome" />
  </>
);

export default Layout;
