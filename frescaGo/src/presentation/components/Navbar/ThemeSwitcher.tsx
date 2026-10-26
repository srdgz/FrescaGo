import { RiMoonLine, RiSunLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";

const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t("theme.toLight") : t("theme.toDark")}
      className="rounded-full p-2 text-gray-600 transition-colors hover:bg-soft hover:text-brand"
    >
      {dark ? (
        <RiSunLine className="text-xl" aria-hidden="true" />
      ) : (
        <RiMoonLine className="text-xl" aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
