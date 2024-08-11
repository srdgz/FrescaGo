import React from "react";
import Logo from "../Utils/Logo";
import {
  RiFacebookCircleFill,
  RiTwitterFill,
  RiInstagramFill,
} from "react-icons/ri";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-primary/10 py-12 mt-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="container flex justify-between items-center"
      >
        <Logo />
        <div className="text-3xl flex items-center gap-4 text-gray-700">
          <RiFacebookCircleFill />
          <RiTwitterFill />
          <RiInstagramFill />
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
