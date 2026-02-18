import { useCallback } from 'react';
import { ToastAndroid, Platform, Alert } from 'react-native';
import { useCart } from '../context/CartContext';

export const useCartActions = () => {
    const { addToCart, updateQuantity, removeFromCart } = useCart();

    const handleAddToCart = useCallback((product: any) => {
        addToCart(product);
        const message = "Added to cart!";
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Alert.alert("Success", message);
        }
    }, [addToCart]);

    const handleUpdateQuantity = useCallback((id: number, delta: number) => {
        updateQuantity(id, delta);
    }, [updateQuantity]);

    const handleRemoveFromCart = useCallback((id: number) => {
        removeFromCart(id);
    }, [removeFromCart]);

    return {
        handleAddToCart,
        handleUpdateQuantity,
        handleRemoveFromCart,
    };
};
