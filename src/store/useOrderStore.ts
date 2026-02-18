import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Order {
    id: number;
    items: any[];
    total: number;
    date: string;
    shippingDetails?: any;
}

interface OrderState {
    orders: Order[];
    addOrder: (order: Order) => void;
    clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set) => ({
            orders: [],
            addOrder: (order) => set((state) => ({
                orders: [order, ...state.orders]
            })),
            clearOrders: () => set({ orders: [] }),
        }),
        {
            name: 'order-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
