import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import HomeScreen from "../views/HomeScreen";
import ProductsScreen from "../views/ProductsScreen";
import SingleProductScreen from "../views/SingleProductScreen";
import ShopScreen from "../views/ShopScreen";
import AboutScreen from "../views/AboutScreen";
import ContactScreen from "../views/ContactScreen";
import UserScreen from "../views/UserScreen";
import EditProfileScreen from "../views/EditProfileScreen";
import OrdersScreen from "../views/OrdersScreen";
import SuccessScreen from "../views/SuccessScreen";
import CancelScreen from "../views/CancelScreen";
import ErrorScreen from "../views/ErrorScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Router = () => {
  return (
    <BrowserRouter basename="">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/productos" element={<ProductsScreen />} />
        <Route path="/productos/:id" element={<SingleProductScreen />} />
        <Route path="/nosotros" element={<AboutScreen />} />
        <Route path="/contacto" element={<ContactScreen />} />
        <Route path="/tienda" element={<ShopScreen />} />
        <Route path="/usuario" element={<UserScreen />} />
        <Route path="/editar" element={<EditProfileScreen />} />
        <Route path="/success" element={<SuccessScreen />} />
        <Route path="/cancel" element={<CancelScreen />} />
        <Route path="/pedidos" element={<OrdersScreen />} />
        <Route path="*" element={<ErrorScreen />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
