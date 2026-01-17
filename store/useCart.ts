import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Define what an Item looks like
interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// 2. Define what the Store looks like
interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

// 3. Create the Store logic
export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item._id === newItem._id);

        if (existingItem) {
          // If item exists, just increase quantity
          set({
            items: currentItems.map((item) =>
              item._id === newItem._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // If new item, add it to array with quantity 1
          set({ items: [...currentItems, { ...newItem, quantity: 1 }] });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item._id !== id),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", // This saves data to localStorage so it persists on refresh
    }
  )
);