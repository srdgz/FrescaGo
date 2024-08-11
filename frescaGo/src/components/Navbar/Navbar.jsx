import React, { useState } from "react";
import ResponsiveMenu from "./ResponsiveMenu";
import { NavbarMenu } from "../../data/data";
import {
  RiLeafFill,
  RiShoppingCart2Line,
  RiMenu3Fill,
  RiUserLine,
} from "react-icons/ri";
import { motion } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="container flex justify-between items-center py-4 md:pt-4"
        >
          <div className="text-2xl flex items-center gap-2 font-bold">
            <p className="text-primary">
              Fresca<span className="text-secondary">Go</span>
            </p>
            <RiLeafFill className="text-green-500" />
          </div>
          <div className="hidden md:block">
            <ul className="flex items-center gap-6 text-gray-600">
              {NavbarMenu.map((menu) => (
                <li key={menu.id}>
                  <a
                    href={menu.link}
                    className="inline-block py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold"
                  >
                    {menu.title}
                  </a>
                </li>
              ))}
              <button className="text-2xl hover:bg-primary hover:text-white rounded-full p-2 duration-200">
                <RiShoppingCart2Line />
              </button>
              <button className="text-2xl hover:bg-primary hover:text-white rounded-full p-2 duration-200">
                <RiUserLine />
              </button>
            </ul>
          </div>
          <div className="md:hidden" onClick={() => setOpen(!open)}>
            <RiMenu3Fill className="text-4xl" />
          </div>
        </motion.div>
      </nav>
      <ResponsiveMenu open={open} />
    </>
  );
};

export default Navbar;
