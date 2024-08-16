const Label = ({ title, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium left-6">
      {title}
    </label>
  );
};

export default Label;
