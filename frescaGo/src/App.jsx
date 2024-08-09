import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";

const App = () => {
  return (
    <>
      <main className="overflow-x-hidden">
        <Navbar />
        <Hero />
        <Products />
      </main>
    </>
  );
};

export default App;
