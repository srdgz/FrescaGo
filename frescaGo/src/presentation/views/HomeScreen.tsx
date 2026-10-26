import Hero from "../components/Hero/Hero";
import Products from "../components/Products/Products";
import Banner from "../components/Banners/Banner";
import BannerSecond from "../components/Banners/BannerSecond";
import BannerThird from "../components/Banners/BannerThird";
import { usePageTitle } from "../hooks/usePageTitle";

const HomeScreen = () => {
  usePageTitle();
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Products />
      <Banner />
      <BannerSecond />
      <BannerThird />
    </div>
  );
};

export default HomeScreen;
