import React from "react";

const Button = ({ text, icon, ...props }) => {
  return (
    <button className="primary-btn flex items-center gap-2 mb-6" {...props}>
      {icon && <span>{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
