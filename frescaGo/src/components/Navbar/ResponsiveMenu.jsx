import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiShoppingCart2Line, RiUserLine } from "react-icons/ri";
import { NavbarMenu } from "../../data/data";
import { store } from "../../lib/store";

function ResponsiveMenu({ open, setOpen }) {
  const navigate = useNavigate();
  const { cartProduct, currentUser } = store();

  const handleNavigation = (link) => {
    navigate(link);
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
                  <button onClick={() => handleNavigation(menu.link)}>
                    {menu.title}
                  </button>
                </li>
              ))}
              <li className="flex flex-row gap-12 items-center">
                <button
                  onClick={() => handleNavigation("/tienda")}
                  className="relative"
                >
                  <RiShoppingCart2Line className="text-2xl" />
                  <span className="inline-flex items-center justify-center bg-white text-primary absolute -top-1 -right-2 text-[9px] rounded-full w-4 h-4">
                    {cartProduct?.length > 0 ? cartProduct?.length : "0"}
                  </span>
                </button>
                <button onClick={() => handleNavigation("/usuario")}>
                  {currentUser ? (
                    <img
                      src={currentUser?.avatar}
                      alt="profileImg"
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
