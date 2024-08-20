import PropTypes from "prop-types";

const Label = ({ title, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium left-6">
      {title}
    </label>
  );
};

Label.propTypes = {
  title: PropTypes.string,
  htmlFor: PropTypes.string,
};

export default Label;
