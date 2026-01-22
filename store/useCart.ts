import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Define Cart Item
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  images: string[];
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}

// 2. Define Actions
interface CartStore {
  cart: CartItem[]; // 👈 MUST be named 'cart'
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: string, color?: string) => void;
  clearCart: () => void;
  totalAmount: () => number; // 👈 MUST be named 'totalAmount'
}

// 3. Create Store
export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [], // 👈 Initial state is 'cart'

      addToCart: (newItem) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find(
          (item) => 
            item._id === newItem._id && 
            item.selectedSize === newItem.selectedSize &&
            item.selectedColor === newItem.selectedColor
        );

        if (existingItem) {
          set({
            cart: currentCart.map((item) =>
              item === existingItem ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({ cart: [...currentCart, { ...newItem, quantity: 1 }] });
        }
      },

      removeFromCart: (id, size, color) => {
        set({
          cart: get().cart.filter(
            (item) => !(item._id === id && item.selectedSize === size && item.selectedColor === color)
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      totalAmount: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    { name: "cart-storage" }
  )
);