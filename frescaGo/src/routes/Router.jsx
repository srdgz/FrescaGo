import React from "react";
import HomeScreen from "../views/HomeScreen";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Router = () => {
  return (
    <BrowserRouter basename="">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
