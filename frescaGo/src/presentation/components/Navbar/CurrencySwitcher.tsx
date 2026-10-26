import { useTranslation } from "react-i18next";
import { CURRENCIES } from "../../../domain/currency";
import type { Currency } from "../../../domain/currency";
import { useAppStore } from "../../AppContext";
import { useMoney } from "../../hooks/useMoney";

const SYMBOLS: Record<Currency, string> = { EUR: "€", USD: "$" };

const CurrencySwitcher = () => {
  const { t } = useTranslation();
  const { setCurrency } = useAppStore();
  const { currency } = useMoney();

  return (
    <div
      role="group"
      aria-label={t("currency.label")}
      className="inline-flex overflow-hidden rounded-full border border-gray-400 text-xs font-semibold"
    >
      {CURRENCIES.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setCurrency(option)}
          aria-pressed={option === currency}
          aria-label={t(`currency.${option}`)}
          className={`px-3 py-1 ${
            option === currency
              ? "bg-primary text-white"
              : "text-gray-600 hover:text-brand"
          }`}
        >
          {SYMBOLS[option]}
        </button>
      ))}
    </div>
  );
};

export default CurrencySwitcher;
