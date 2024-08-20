import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Button = ({ text, icon, to, className, ...props }) => {
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

Button.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.element,
  to: PropTypes.string,
  className: PropTypes.string,
};

export default Button;
