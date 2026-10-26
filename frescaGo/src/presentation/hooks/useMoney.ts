import { useCallback } from "react";
import {
  defaultCurrencyFor,
  formatCurrencyAmount,
  formatMoney,
} from "../../domain/currency";
import type { Currency } from "../../domain/currency";
import { useAppStore } from "../AppContext";
import { useLocale } from "../LocaleContext";

export const useMoney = () => {
  const locale = useLocale();
  const { currency: chosen, usdPerEur } = useAppStore();
  const currency: Currency = chosen ?? defaultCurrencyFor(locale);

  const format = useCallback(
    (amountEur: number, as: Currency = currency, rate: number = usdPerEur) =>
      formatMoney(amountEur, as, rate, locale),
    [currency, usdPerEur, locale]
  );

  const formatAmount = useCallback(
    (amount: number, as: Currency = currency) =>
      formatCurrencyAmount(amount, as, locale),
    [currency, locale]
  );

  return { currency, usdPerEur, format, formatAmount };
};
