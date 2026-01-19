import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Updated Interface for Fashion Items
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  // Changed from 'image' to 'images' to match your Product model
  images: string[]; 
  // New Fashion Fields
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          // Check if item exists with SAME ID + SIZE + COLOR
          const existingItem = state.items.find(
            (item) => 
              item._id === newItem._id && 
              item.selectedSize === newItem.selectedSize &&
              item.selectedColor === newItem.selectedColor
          );
          
          if (existingItem) {
            // If exact variant exists, increase quantity
            return {
              items: state.items.map((item) =>
                item === existingItem
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            // If it's a new size/color variant, add as new item
            // Ensure quantity is set to 1 if not provided
            return {
              items: [...state.items, { ...newItem, quantity: 1 }],
            };
          }
        });
      },

      // Updated to remove specific variant, not just all items with that ID
      removeItem: (id, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) => 
              // Keep item if ANY of these don't match
              !(item._id === id && item.selectedSize === size && item.selectedColor === color)
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'shopping-cart', // Unique name for LocalStorage
    }
  )
);