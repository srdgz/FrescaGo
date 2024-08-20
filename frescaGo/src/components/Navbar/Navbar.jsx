import { useState } from "react";
import ResponsiveMenu from "./ResponsiveMenu";
import Logo from "../Utils/Logo";
import { NavbarMenu } from "../../data/data";
import { RiShoppingCart2Line, RiMenu3Fill, RiUserLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { store } from "../../lib/store";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { cartProduct, currentUser } = store();

  return (
    <>
      <nav>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="container flex justify-between items-center py-4 md:pt-4"
        >
          <Logo />
          <div className="hidden md:block">
            <ul className="flex items-center gap-6 text-gray-600">
              {NavbarMenu.map((menu) => (
                <li key={menu.id}>
                  <Link
                    to={menu.link}
                    className="inline-block py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold"
                  >
                    {menu.title}
                  </Link>
                </li>
              ))}
              <Link to="/tienda" className="relative block">
                <RiShoppingCart2Line className="hover:text-primary duration-200 text-2xl" />
                <span className="inline-flex items-center justify-center bg-primary text-white absolute -top-1 -right-2 text-[9px] rounded-full w-4 h-4">
                  {cartProduct?.length > 0 ? cartProduct?.length : "0"}
                </span>
              </Link>
              <Link to="/usuario">
                {currentUser ? (
                  <img
                    src={
                      currentUser?.avatar
                        ? currentUser?.avatar
                        : "https://i.ibb.co/qMpPq5Z/user.png"
                    }
                    alt="profileImg"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <RiUserLine className="hover:text-primary duration-200 text-2xl" />
                )}
              </Link>
            </ul>
          </div>
          <div className="md:hidden" onClick={() => setOpen(!open)}>
            <RiMenu3Fill className="text-4xl" />
          </div>
        </motion.div>
      </nav>
      <ResponsiveMenu open={open} setOpen={setOpen} />
    </>
  );
};

export default Navbar;
