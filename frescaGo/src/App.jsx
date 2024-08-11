import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import Banner from "./components/Banners/Banner";
import BannerSecond from "./components/Banners/BannerSecond";
import BannerThird from "./components/Banners/BannerThird";

const App = () => {
  return (
    <>
      <main className="overflow-x-hidden">
        <Navbar />
        <Hero />
        <Products />
        <Banner />
        <BannerSecond />
        <BannerThird />
      </main>
    </>
  );
};

export default App;
