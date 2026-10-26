import { Suspense, lazy, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { LOCALES } from "../../domain/locale";
import type { Locale } from "../../domain/locale";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import SkipLink from "../components/Utils/SkipLink";
import { useAppStore } from "../AppContext";
import { LocaleProvider } from "../LocaleContext";
import HomeScreen from "../views/HomeScreen";
import ErrorScreen from "../views/ErrorScreen";
import Loading from "../components/Utils/Loading";
import { ROUTE_SLUGS, detectBrowserLocale } from "./paths";

const ProductsScreen = lazy(() => import("../views/ProductsScreen"));
const SingleProductScreen = lazy(() => import("../views/SingleProductScreen"));
const ShopScreen = lazy(() => import("../views/ShopScreen"));
const AboutScreen = lazy(() => import("../views/AboutScreen"));
const ContactScreen = lazy(() => import("../views/ContactScreen"));
const UserScreen = lazy(() => import("../views/UserScreen"));
const EditProfileScreen = lazy(() => import("../views/EditProfileScreen"));
const OrdersScreen = lazy(() => import("../views/OrdersScreen"));
const SuccessScreen = lazy(() => import("../views/SuccessScreen"));
const CancelScreen = lazy(() => import("../views/CancelScreen"));

const LocaleLayout = ({ locale }: { locale: Locale }) => {
  const { t } = useTranslation();
  const { loadRate } = useAppStore();
  const { pathname } = useLocation();
  const content = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    loadRate();
  }, [loadRate]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    content.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <LocaleProvider locale={locale}>
      <SkipLink />
      <Navbar />
      <main id="main-content" ref={content} tabIndex={-1} className="min-h-svh outline-hidden">
        <Suspense fallback={<Loading title={t("common.loading")} />}>
          <Outlet />
        </Suspense>
      </main>
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
