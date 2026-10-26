import type { Ref } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import Label from "./Label";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  autoComplete: "new-password" | "current-password";
  visible: boolean;
  onToggleVisible: () => void;
  describedBy?: string;
  invalid?: boolean;
  minLength?: number;
  inputRef?: Ref<HTMLInputElement>;
}

const PasswordInput = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  autoComplete,
  visible,
  onToggleVisible,
  describedBy,
  invalid,
  minLength,
  inputRef,
}: PasswordInputProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Label title={label} htmlFor={id} />
      <div className="relative mt-2">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={describedBy}
          className="field pr-12"
        />
        <button
          type="button"
          onClick={onToggleVisible}
          aria-label={visible ? t("password.hide") : t("password.show")}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-3 text-gray-600 transition-colors hover:text-brand"
        >
          {visible ? (
            <AiOutlineEyeInvisible className="text-2xl" aria-hidden="true" />
          ) : (
            <AiOutlineEye className="text-2xl" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
