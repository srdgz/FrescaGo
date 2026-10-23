import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import type { UseCases } from "../application/useCases";
import { AppProvider } from "../presentation/AppContext";
import { createAppStore } from "../presentation/store";

export const renderWithApp = (
  ui: ReactElement,
  overrides: Partial<UseCases> = {},
  route = "/"
) => {
  const useCases = {
    loadUser: async () => null,
    ...overrides,
  } as UseCases;
  const store = createAppStore(useCases);

  return {
    store,
    useCases,
    ...render(
      <AppProvider useCases={useCases} store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </AppProvider>
    ),
  };
};
