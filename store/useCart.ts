import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  images: string[];
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, size: string | undefined, color: string | undefined, quantity: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (item) => {
        const { cart } = get();
        const existingItem = cart.find(
          (i) => i._id === item._id && i.selectedSize === item.selectedSize && i.selectedColor === item.selectedColor
        );

        if (existingItem) {
          set({
            cart: cart.map((i) =>
              i._id === item._id && i.selectedSize === item.selectedSize && i.selectedColor === item.selectedColor
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ cart: [...cart, item] });
        }
      },

      removeFromCart: (id, size, color) => {
        set({
          cart: get().cart.filter(
            (i) => !(i._id === id && i.selectedSize === size && i.selectedColor === color)
          ),
        });
      },

      updateQuantity: (id, size, color, quantity) => {
        const { cart } = get();
        set({
          cart: cart.map((i) =>
            i._id === id && i.selectedSize === size && i.selectedColor === color
              ? { ...i, quantity: quantity }
              : i
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      totalAmount: () => {
        return get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);