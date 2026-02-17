import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData, saveData } from '../utils/storage';

type WishlistItem = {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
    rating?: {
        rate: number;
        count: number;
    };
};

type WishlistContextType = {
    wishlist: WishlistItem[];
    toggleWishlist: (product: WishlistItem) => void;
    isWishlisted: (productId: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        const storedWishlist = await getData('wishlist');
        if (storedWishlist) setWishlist(storedWishlist);
    };

    const toggleWishlist = async (product: WishlistItem) => {
        let newWishlist;
        const exists = wishlist.find(item => item.id === product.id);

        if (exists) {
            newWishlist = wishlist.filter(item => item.id !== product.id);
        } else {
            newWishlist = [...wishlist, product];
        }

        setWishlist(newWishlist);
        await saveData('wishlist', newWishlist);
    };

    const isWishlisted = (productId: number) => {
        return wishlist.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
