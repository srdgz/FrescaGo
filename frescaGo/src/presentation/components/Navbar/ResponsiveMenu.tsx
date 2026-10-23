import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiShoppingCart2Line, RiUserLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import CurrencySwitcher from "./CurrencySwitcher";
import { NavbarMenu } from "../../data/navbar";
import { useAppStore } from "../../AppContext";
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
          className="absolute top-20 left-0 w-full h-screen z-20"
        >
          <div className="text-xl font-semibold  bg-primary text-white py-10 m-6 rounded-3xl">
            <ul className="flex flex-col items-center gap-10">
              {NavbarMenu.map((menu) => (
                <li key={menu.id}>
                  <button onClick={() => handleNavigation(menu.route)}>
                    {t(menu.label)}
                  </button>
                </li>
              ))}
              <li className="flex flex-row gap-4 items-center text-gray-900">
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
                  <span className="inline-flex items-center justify-center bg-white text-primary absolute -top-1 -right-2 text-[9px] rounded-full w-4 h-4">
                    {cartProduct?.length > 0 ? cartProduct?.length : "0"}
                  </span>
                </button>
                <button
                  onClick={() => handleNavigation("user")}
                  aria-label={t("nav.account")}
                >
                  {currentUser ? (
                    <img
                      src={
                        currentUser?.avatar
                          ? currentUser?.avatar
                          : "https://i.ibb.co/qMpPq5Z/user.png"
                      }
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
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
