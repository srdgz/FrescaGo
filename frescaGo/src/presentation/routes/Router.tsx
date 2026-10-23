import { useEffect } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { LOCALES } from "../../domain/locale";
import type { Locale } from "../../domain/locale";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useAppStore } from "../AppContext";
import { LocaleProvider } from "../LocaleContext";
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
import { ROUTE_SLUGS, detectBrowserLocale } from "./paths";

const LocaleLayout = ({ locale }: { locale: Locale }) => {
  const { loadRate } = useAppStore();

  useEffect(() => {
    loadRate();
  }, [loadRate]);

  return (
    <LocaleProvider locale={locale}>
      <Navbar />
      <Outlet />
      <Footer />
    </LocaleProvider>
  );
};

const RootRedirect = () => {
  const locale = detectBrowserLocale(navigator.languages ?? [navigator.language]);
  return <Navigate to={`/${locale}`} replace />;
};

const LegacyRedirect = () => {
  const { pathname, search } = useLocation();
  return <Navigate to={`/es${pathname}${search}`} replace />;
};

const localeRoutes = (locale: Locale) => (
  <Route key={locale} path={`/${locale}`} element={<LocaleLayout locale={locale} />}>
    <Route index element={<HomeScreen />} />
    <Route path={ROUTE_SLUGS.products[locale]} element={<ProductsScreen />} />
    <Route path={`${ROUTE_SLUGS.products[locale]}/:id`} element={<SingleProductScreen />} />
    <Route path={ROUTE_SLUGS.about[locale]} element={<AboutScreen />} />
    <Route path={ROUTE_SLUGS.contact[locale]} element={<ContactScreen />} />
    <Route path={ROUTE_SLUGS.shop[locale]} element={<ShopScreen />} />
    <Route path={ROUTE_SLUGS.user[locale]} element={<UserScreen />} />
    <Route path={ROUTE_SLUGS.editProfile[locale]} element={<EditProfileScreen />} />
    <Route path={ROUTE_SLUGS.orders[locale]} element={<OrdersScreen />} />
    <Route path={ROUTE_SLUGS.success[locale]} element={<SuccessScreen />} />
    <Route path={ROUTE_SLUGS.cancel[locale]} element={<CancelScreen />} />
    <Route path="*" element={<ErrorScreen />} />
  </Route>
);

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RootRedirect />} />
    {LOCALES.map(localeRoutes)}
    <Route path="*" element={<LegacyRedirect />} />
  </Routes>
);

const Router = () => (
  <BrowserRouter basename="">
    <AppRoutes />
  </BrowserRouter>
);

export default Router;
