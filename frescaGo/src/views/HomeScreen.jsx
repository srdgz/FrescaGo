import React from "react";
import Hero from "../components/Hero/Hero";
import Products from "../components/Products/Products";
import Banner from "../components/Banners/Banner";
import BannerSecond from "../components/Banners/BannerSecond";
import BannerThird from "../components/Banners/BannerThird";

const HomeScreen = () => {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <Products />
      <Banner />
      <BannerSecond />
      <BannerThird />
    </main>
  );
};

export default HomeScreen;
