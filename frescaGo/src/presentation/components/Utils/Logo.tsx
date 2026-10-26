import { Link } from "react-router-dom";
import { RiLeafFill } from "react-icons/ri";
import { useLocalePath } from "../../LocaleContext";

const Logo = () => {
  const path = useLocalePath();
  return (
    <Link
      to={path("home")}
      className="flex items-center gap-1.5 font-display text-2xl font-bold"
    >
      <span className="text-brand">
        Fresca<span className="text-accent">Go</span>
      </span>
      <RiLeafFill className="text-primary" aria-hidden="true" />
    </Link>
  );
};

export default Logo;
