import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiShoppingCart2Line, RiUserLine } from "react-icons/ri";
import { NavbarMenu } from "../../data/data";

function ResponsiveMenu({ open, setOpen }) {
  const navigate = useNavigate();

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
              <li className="flex flex-row gap-12">
                <RiShoppingCart2Line />
                <RiUserLine />
              </li>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ResponsiveMenu;
