interface LabelProps {
  title?: string;
  htmlFor?: string;
}

const Label = ({ title, htmlFor }: LabelProps) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium left-6">
      {title}
    </label>
  );
};

export default Label;
