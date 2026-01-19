import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Define what a Cart Item looks like (Updated for Fashion)
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  images: string[];     // Changed from 'image' to 'images' to match your Product model
  selectedSize?: string;  // Added optional size
  selectedColor?: string; // Added optional color
  quantity: number;
}

// 2. Define the Store Actions
interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;     // Renamed from addItem
  removeFromCart: (id: string, size?: string, color?: string) => void; // Renamed from removeItem
  clearCart: () => void;
  getCartTotal: () => number;
}

// 3. Create the Store logic
export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (newItem) => {
        const currentItems = get().items;
        
        // Check if item exists with the SAME ID, Size, AND Color
        const existingItem = currentItems.find(
          (item) => 
            item._id === newItem._id && 
            item.selectedSize === newItem.selectedSize &&
            item.selectedColor === newItem.selectedColor
        );

        if (existingItem) {
          // If exact variant exists, increase quantity
          set({
            items: currentItems.map((item) =>
              item === existingItem
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // If new variant, add to cart with quantity 1
          // Ensure we pass the whole item including images/sizes
          set({ items: [...currentItems, { ...newItem, quantity: 1 }] });
        }
      },

      // Remove specific variant (e.g. remove only the Red shirt, keep the Blue one)
      removeFromCart: (id, size, color) => {
        set({
          items: get().items.filter(
            (item) => 
              !(item._id === id && item.selectedSize === size && item.selectedColor === color)
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      // Helper to get total price
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: "cart-storage", // Saves to localStorage
    }
  )
);