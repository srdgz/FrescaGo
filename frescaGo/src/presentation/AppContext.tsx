import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { UseCases } from "../application/useCases";
import { createAppStore } from "./store";
import type { AppState, AppStore } from "./store";

interface AppContextValue {
  useCases: UseCases;
  useStore: AppStore;
}

const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  useCases: UseCases;
  store?: AppStore;
  children: ReactNode;
}

export const AppProvider = ({ useCases, store, children }: AppProviderProps) => {
  const value = useMemo(
    () => ({ useCases, useStore: store ?? createAppStore(useCases) }),
    [useCases, store]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppProvider is missing");
  }
  return context;
};

export const useUseCases = (): UseCases => useAppContext().useCases;

export const useAppStore = (): AppState => useAppContext().useStore();
