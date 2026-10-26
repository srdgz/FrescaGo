import { useId, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { RiQuestionLine } from "react-icons/ri";

interface TooltipProps {
  label: string;
  children: ReactNode;
}

const Tooltip = ({ label, children }: TooltipProps) => {
  const id = useId();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovered || focused || pinned;

  const close = () => {
    setHovered(false);
    setFocused(false);
    setPinned(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      close();
    }
  };

  return (
    <span
      className="relative ml-2 inline-flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setPinned((value) => !value)}
        onFocus={() => setFocused(true)}
        onBlur={close}
        onKeyDown={handleKeyDown}
        className="rounded-full text-gray-500 transition-colors hover:text-brand"
      >
        <RiQuestionLine className="h-5 w-5" aria-hidden="true" />
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-0 z-20 mb-2 w-56 max-w-[75vw] rounded-xl bg-ink px-3 py-2 text-xs font-medium leading-5 text-canvas shadow-lg"
        >
          {children}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
