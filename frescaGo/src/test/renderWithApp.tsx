import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { FALLBACK_USD_PER_EUR } from "../domain/currency";
import type { Locale } from "../domain/locale";
import type { UseCases } from "../application/useCases";
import { AppProvider } from "../presentation/AppContext";
import { LocaleProvider } from "../presentation/LocaleContext";
import { createAppStore } from "../presentation/store";
import type { AppState } from "../presentation/store";

interface Options {
  route?: string | { pathname: string; state?: unknown };
  locale?: Locale;
  state?: Partial<AppState>;
}

export const renderWithApp = (
  ui: ReactElement,
  overrides: Partial<UseCases> = {},
  { route = "/", locale = "es", state }: Options = {}
) => {
  const useCases = {
    loadUser: async () => null,
    getExchangeRate: async () => ({
      usdPerEur: FALLBACK_USD_PER_EUR,
      date: "2026-10-23",
      source: "fallback" as const,
    }),
    ...overrides,
  } as UseCases;
  const store = createAppStore(useCases);
  if (state) {
    store.setState(state);
  }

  return {
    store,
    useCases,
    ...render(
      <AppProvider useCases={useCases} store={store}>
        <MemoryRouter initialEntries={[route]}>
          <LocaleProvider locale={locale}>{ui}</LocaleProvider>
        </MemoryRouter>
      </AppProvider>
    ),
  };
};
