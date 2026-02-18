import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform, ToastAndroid } from 'react-native';

interface CartItem {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartState {
    cart: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, delta: number) => void;
    clearCart: () => void;
    totalPrice: number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            totalPrice: 0,

            addToCart: (product) => {
                const currentCart = get().cart;
                const existingItem = currentCart.find((item) => item.id === product.id);

                let newCart;
                if (existingItem) {
                    newCart = currentCart.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    newCart = [...currentCart, { ...product, quantity: 1 }];
                }

                set({
                    cart: newCart,
                    totalPrice: newCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
                });

                if (Platform.OS === 'android') {
                    ToastAndroid.show("Added to cart!", ToastAndroid.SHORT);
                } else {
                    Alert.alert("Success", "Added to cart!");
                }
            },

            removeFromCart: (productId) => {
                const newCart = get().cart.filter((item) => item.id !== productId);
                set({
                    cart: newCart,
                    totalPrice: newCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
                });
            },

            updateQuantity: (productId, delta) => {
                const newCart = get().cart.map((item) => {
                    if (item.id === productId) {
                        const newQty = Math.max(1, item.quantity + delta);
                        return { ...item, quantity: newQty };
                    }
                    return item;
                });
                set({
                    cart: newCart,
                    totalPrice: newCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
                });
            },

            clearCart: () => set({ cart: [], totalPrice: 0 }),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
