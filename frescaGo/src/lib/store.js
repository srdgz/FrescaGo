import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const customStorage = {
  getItem: (name) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const store = create(
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
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        try {
          if (docSnap.exists()) {
            set({ currentUser: docSnap.data(), isLoading: false });
          }
        } catch (error) {
          console.error("getUserInfo error", error);
          set({ currentUser: null, isLoading: false });
        }
      },
      addToCart: (product) => {
        return new Promise((resolve) => {
          set((state) => {
            const existingProduct = state.cartProduct.find(
              (p) => p.id === product.id
            );
            if (existingProduct) {
              return {
                cartProduct: state.cartProduct.map((p) =>
                  p.id === product.id
                    ? { ...p, quantity: (p.quantity || 0) + 1 }
                    : p
                ),
              };
            } else {
              return {
                cartProduct: [
                  ...state.cartProduct,
                  { ...product, quantity: 1 },
                ],
              };
            }
          });
          resolve();
        });
      },
      decreaseQuantity: (productId) => {
        set((state) => {
          const existingProduct = state.cartProduct.find(
            (p) => p.id === productId
          );
          if (existingProduct) {
            return {
              cartProduct: state.cartProduct.map((p) =>
                p.id === productId
                  ? { ...p, quantity: Math.max(p.quantity - 1, 1) }
                  : p
              ),
            };
          } else {
            return state;
          }
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({
          cartProduct: state.cartProduct.filter(
            (item) => item.id !== productId
          ),
        }));
      },
      resetCart: () => {
        set({ cartProduct: [] });
      },
    }),
    {
      name: "frescago-storage",
      storage: customStorage,
    }
  )
);
