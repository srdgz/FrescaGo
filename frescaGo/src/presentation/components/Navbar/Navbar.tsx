import { useState } from "react";
import ResponsiveMenu from "./ResponsiveMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import CurrencySwitcher from "./CurrencySwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import Logo from "../Utils/Logo";
import { NavbarMenu } from "../../data/navbar";
import { RiShoppingCart2Line, RiMenu3Fill, RiUserLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../AppContext";
import UserAvatar from "../Utils/UserAvatar";
import { useLocalePath } from "../../LocaleContext";

const Navbar = () => {
  const { t } = useTranslation();
  const path = useLocalePath();
  const [open, setOpen] = useState(false);
  const { cartProduct, currentUser } = useAppStore();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur">
      <nav aria-label={t("nav.mainMenu")}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="container flex items-center justify-between py-3"
        >
          <Logo />
          <div className="hidden md:block">
            <ul className="flex items-center gap-6 text-gray-600">
              {NavbarMenu.map((menu) => (
                <li key={menu.id}>
                  <Link
                    to={path(menu.route)}
                    className="inline-block px-3 py-1 font-semibold underline-offset-8 decoration-2 hover:text-brand hover:underline"
                  >
                    {t(menu.label)}
                  </Link>
                </li>
              ))}
              <li>
                <ThemeSwitcher />
              </li>
              <li>
                <LanguageSwitcher />
              </li>
              <li>
                <CurrencySwitcher />
              </li>
              <li>
                <Link
                  to={path("shop")}
                  className="relative block"
                >
                  <RiShoppingCart2Line className="hover:text-brand duration-200 text-2xl" />
                  <span className="sr-only">{t("nav.cart")}</span>
                  <span className="inline-flex items-center justify-center absolute -right-2 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {cartProduct?.length > 0 ? cartProduct?.length : "0"}
                  </span>
                </Link>
              </li>
              <li>
                <Link to={path("user")} aria-label={t("nav.account")}>
                  {currentUser ? (
                    <UserAvatar user={currentUser} className="h-8 w-8 text-xs" />
                  ) : (
                    <RiUserLine className="hover:text-brand duration-200 text-2xl" />
                  )}
                </Link>
              </li>
            </ul>
          </div>
          <button
            type="button"
            className="md:hidden"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <RiMenu3Fill className="text-4xl" />
          </button>
        </motion.div>
      </nav>
      <ResponsiveMenu open={open} setOpen={setOpen} />
    </header>
  );
};

export default Navbar;
