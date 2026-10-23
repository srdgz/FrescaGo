import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UseCases } from "../application/useCases";
import { addItem, decreaseItem, removeItem } from "../domain/cart";
import type { CartItem } from "../domain/cart";
import type { Product } from "../domain/catalog";
import type { User } from "../domain/user";

export interface AppState {
  currentUser: User | null;
  isLoading: boolean;
  cartProduct: CartItem[];
  getUserInfo: (uid: string | undefined) => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  resetCart: () => void;
}

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

export const createAppStore = (useCases: Pick<UseCases, "loadUser">) =>
  create<AppState>()(
    persist(
      (set) => ({
        currentUser: null,
        isLoading: true,
        cartProduct: [],
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
      }),
      {
        name: "frescago-storage",
        storage: jsonStorage,
      }
    )
  );

export type AppStore = ReturnType<typeof createAppStore>;
