import type { ComponentProps, ReactElement } from "react";
import { Link } from "react-router-dom";

interface ButtonProps extends Omit<ComponentProps<typeof Link>, "to"> {
  text: string;
  icon?: ReactElement;
  to: string;
  className?: string;
}

const Button = ({ text, icon, to, className = "", ...props }: ButtonProps) => {
  return (
    <Link
      to={to}
      className={`primary-btn flex items-center gap-2 mb-6 ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {text}
    </Link>
  );
};

export default Button;
