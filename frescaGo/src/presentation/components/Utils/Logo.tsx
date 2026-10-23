import { Link } from "react-router-dom";
import { RiLeafFill } from "react-icons/ri";

const Logo = () => {
  return (
    <Link to="/" className="text-2xl flex items-center gap-2 font-bold">
      <p className="text-primary">
        Fresca<span className="text-secondary">Go</span>
      </p>
      <RiLeafFill className="text-green-500" />
    </Link>
  );
};

export default Logo;
