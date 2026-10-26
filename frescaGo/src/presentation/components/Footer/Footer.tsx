import Logo from "../Utils/Logo";
import {
  RiFacebookCircleFill,
  RiTwitterFill,
  RiInstagramFill,
} from "react-icons/ri";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="mt-12 border-t border-line bg-soft py-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="container flex flex-col md:flex-row justify-between items-center"
      >
        <div className="flex flex-col items-center md:items-start md:flex-1">
          <Logo />
          <p className="mt-4 text-center md:text-left text-gray-700">
            {t("footer.2024WebRealizadaPor")}{" "}
            <a
              href="https://github.com/srdgz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand underline-offset-4 hover:underline"
            >
              {t("footer.sandraRodriguez")}
            </a>
          </p>
        </div>
        <div className="text-3xl flex items-center gap-4 text-gray-700 mt-6 md:mt-0">
          <a
            href="https://www.facebook.com" aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 hover:text-brand"
          >
            <RiFacebookCircleFill />
          </a>
          <a
            href="https://www.twitter.com" aria-label="Twitter"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 hover:text-brand"
          >
            <RiTwitterFill />
          </a>
          <a
            href="https://www.instagram.com" aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 hover:text-brand"
          >
            <RiInstagramFill />
          </a>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
