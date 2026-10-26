import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UseCases } from "../application/useCases";
import { addItem, decreaseItem, removeItem } from "../domain/cart";
import type { CartItem } from "../domain/cart";
import type { Product } from "../domain/catalog";
import { FALLBACK_USD_PER_EUR, isCurrency } from "../domain/currency";
import type { Currency } from "../domain/currency";
import type { User } from "../domain/user";

export interface AppState {
  currentUser: User | null;
  isLoading: boolean;
  cartProduct: CartItem[];
  currency: Currency | null;
  usdPerEur: number;
  getUserInfo: (uid: string | undefined) => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  resetCart: () => void;
  setCurrency: (currency: Currency) => void;
  loadRate: () => Promise<void>;
}

type StoreUseCases = Pick<UseCases, "loadUser" | "getExchangeRate">;

const jsonStorage = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const createAppStore = (useCases: StoreUseCases) =>
  create<AppState>()(
    persist(
      (set) => ({
        currentUser: null,
        isLoading: true,
        cartProduct: [],
        currency: null,
        usdPerEur: FALLBACK_USD_PER_EUR,
        getUserInfo: async (uid) => {
          if (!uid) {
            set({ currentUser: null, isLoading: false });
            return;
          }
          try {
            const user = await useCases.loadUser(uid);
            set({ currentUser: user, isLoading: false });
          } catch (error) {
            console.error("getUserInfo error", error);
            set({ currentUser: null, isLoading: false });
          }
        },
        addToCart: async (product) => {
          set((state) => ({ cartProduct: addItem(state.cartProduct, product) }));
        },
        decreaseQuantity: (productId) => {
          set((state) => ({
            cartProduct: decreaseItem(state.cartProduct, productId),
          }));
        },
        removeFromCart: (productId) => {
          set((state) => ({
            cartProduct: removeItem(state.cartProduct, productId),
          }));
        },
        resetCart: () => {
          set({ cartProduct: [] });
        },
        setCurrency: (currency) => {
          set({ currency });
        },
        loadRate: async () => {
          try {
            const { usdPerEur } = await useCases.getExchangeRate();
            set({ usdPerEur });
          } catch (error) {
            console.error("loadRate error", error);
          }
        },
      }),
      {
        name: "frescago-storage",
        storage: jsonStorage,
        partialize: (state) => ({
          currentUser: state.currentUser,
          cartProduct: state.cartProduct,
          currency: state.currency,
        }),
        merge: (persisted, current) => {
          const saved = (persisted ?? {}) as Partial<AppState>;
          return {
            ...current,
            ...saved,
            currency: isCurrency(saved.currency) ? saved.currency : null,
          };
        },
      }
    )
  );

export type AppStore = ReturnType<typeof createAppStore>;
