import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiShoppingCart2Line, RiUserLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import CurrencySwitcher from "./CurrencySwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { NavbarMenu } from "../../data/navbar";
import { useAppStore } from "../../AppContext";
import UserAvatar from "../Utils/UserAvatar";
import { useLocalePath } from "../../LocaleContext";
import type { RouteKey } from "../../routes/paths";

interface ResponsiveMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function ResponsiveMenu({ open, setOpen }: ResponsiveMenuProps) {
  const { t } = useTranslation();
  const path = useLocalePath();
  const navigate = useNavigate();
  const { cartProduct, currentUser } = useAppStore();

  const handleNavigation = (route: RouteKey) => {
    navigate(path(route));
    setOpen(false);
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className="absolute left-0 top-full z-20 h-screen w-full bg-canvas/95 md:hidden"
        >
          <div className="card m-4 py-8 text-xl font-semibold">
            <ul className="flex flex-col items-center gap-10">
              {NavbarMenu.map((menu) => (
                <li key={menu.id}>
                  <button onClick={() => handleNavigation(menu.route)}>
                    {t(menu.label)}
                  </button>
                </li>
              ))}
              <li className="flex flex-row items-center gap-3">
                <ThemeSwitcher />
                <LanguageSwitcher />
                <CurrencySwitcher />
              </li>
              <li className="flex flex-row gap-12 items-center">
                <button
                  onClick={() => handleNavigation("shop")}
                  className="relative"
                  aria-label={t("nav.cart")}
                >
                  <RiShoppingCart2Line className="text-2xl" />
                  <span className="absolute -right-2 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {cartProduct?.length > 0 ? cartProduct?.length : "0"}
                  </span>
                </button>
                <button
                  onClick={() => handleNavigation("user")}
                  aria-label={t("nav.account")}
                >
                  {currentUser ? (
                    <UserAvatar user={currentUser} className="h-8 w-8 text-xs" />
                  ) : (
                    <RiUserLine className="text-2xl" />
                  )}
                </button>
              </li>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ResponsiveMenu;
