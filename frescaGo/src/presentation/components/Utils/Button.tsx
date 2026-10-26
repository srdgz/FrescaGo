import type { ComponentProps, ReactElement } from "react";
import { Link } from "react-router-dom";

interface ButtonProps extends Omit<ComponentProps<typeof Link>, "to"> {
  text: string;
  icon?: ReactElement;
  variant?: "primary" | "outline";
  to: string;
  className?: string;
}

const Button = ({
  text,
  icon,
  to,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <Link
      to={to}
      className={`${variant === "outline" ? "outline-btn" : "primary-btn"} gap-2 mb-6 ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {text}
    </Link>
  );
};

export default Button;
