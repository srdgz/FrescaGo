import React from "react";
import { RiLeafFill } from "react-icons/ri";

const Logo = () => {
  return (
    <div className="text-2xl flex items-center gap-2 font-bold">
      <p className="text-primary">
        Fresca<span className="text-secondary">Go</span>
      </p>
      <RiLeafFill className="text-green-500" />
    </div>
  );
};

export default Logo;
