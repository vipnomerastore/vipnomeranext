import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NumberItem {
  id: string;
  phone?: string;
  price?: number;
  quantity?: number;
  region: string[];
  old_price?: number;
  part_price?: number;
  partner_price?: number;
  credit_month_count?: number;
  currency?: string;
  description?: string;
  operator?: string;
}

interface CartState {
  items: NumberItem[];
  lastAddedItem: NumberItem | null;
  addItem: (item: NumberItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  clearLastAddedItem: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastAddedItem: null,
      addItem: (item) =>
        set((state) => {
          if (state.items.some((i) => i.phone === item.phone)) {
            return state; // Игнорируем добавление, если номер уже есть
          }
          return {
            items: [...state.items, { ...item, quantity: 1 }],
            lastAddedItem: item,
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
          ),
        })),

      clearCart: () => set({ items: [], lastAddedItem: null }),

      getTotal: () =>
        get().items.reduce(
          (total, item) => total + item.price! * item.quantity!,
          0
        ),

      clearLastAddedItem: () => set({ lastAddedItem: null }),
    }),
    {
      name: "cart-storage",
    }
  )
);
