import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WishlistItem {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
    rating?: {
        rate: number;
        count: number;
    };
}

interface WishlistState {
    wishlist: WishlistItem[];
    toggleWishlist: (product: any) => void;
    isWishlisted: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            wishlist: [],

            toggleWishlist: (product) => {
                const currentWishlist = get().wishlist;
                const isItemWishlisted = currentWishlist.some((item) => item.id === product.id);

                if (isItemWishlisted) {
                    set({ wishlist: currentWishlist.filter((item) => item.id !== product.id) });
                } else {
                    set({ wishlist: [...currentWishlist, product] });
                }
            },

            isWishlisted: (productId) => {
                return get().wishlist.some((item) => item.id === productId);
            },
        }),
        {
            name: 'wishlist-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
