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
        className="container flex flex-col md:flex-row justify-between items-center"
      >
        <div className="flex flex-col items-center md:items-start md:flex-1">
          <Logo />
          <p className="mt-4 text-center md:text-left text-gray-700">
            © 2024 | Web realizada por{" "}
            <a
              href="https://github.com/srdgz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline"
            >
              Sandra Rodríguez
            </a>
          </p>
        </div>
        <div className="text-3xl flex items-center gap-4 text-gray-700 mt-6 md:mt-0">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-secondary transition-colors duration-300"
          >
            <RiFacebookCircleFill />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-secondary transition-colors duration-300"
          >
            <RiTwitterFill />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-secondary transition-colors duration-300"
          >
            <RiInstagramFill />
          </a>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
