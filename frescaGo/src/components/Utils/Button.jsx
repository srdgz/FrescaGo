import React from "react";
import { Link } from "react-router-dom";

const Button = ({ text, icon, to, ...props }) => {
  return (
    <Link
      to={to}
      className="primary-btn flex items-center gap-2 mb-6"
      {...props}
    >
      {icon && <span>{icon}</span>}
      {text}
    </Link>
  );
};

export default Button;
