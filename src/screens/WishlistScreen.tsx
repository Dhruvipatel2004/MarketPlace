import React, { useCallback } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView
} from 'react-native';
import { ArrowLeft, ArchiveX } from 'lucide-react-native';
import { theme } from '../styles/theme';
import ProductCard from '../components/common/ProductCard';
import EmptyState from '../components/common/EmptyState';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';

export default function WishlistScreen({ navigation }: any) {
    const wishlist = useWishlistStore((state) => state.wishlist);
    const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
    const addToCart = useCartStore((state) => state.addToCart);

    const renderItem = useCallback(({ item }: { item: any }) => (
        <ProductCard
            product={item}
            onPress={() => navigation.navigate("Details", { product: item })}
            onWishlistToggle={() => toggleWishlist(item)}
            isWishlisted={wishlist.some(w => w.id === item.id)}
            variant="list"
            onAddToCart={() => addToCart(item)}
        />
    ), [navigation, toggleWishlist, wishlist, addToCart]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Wishlist</Text>
                <View style={{ width: 40 }} />
            </View>

            {wishlist.length > 0 ? (
                <FlatList
                    data={wishlist}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    // Performance optimizations
                    removeClippedSubviews={true}
                    initialNumToRender={8}
                />
            ) : (
                <EmptyState
                    icon={<ArchiveX size={80} color={theme.colors.border} />}
                    title="Your Wishlist is Empty"
                    subtitle="Save items that you like for later!"
                    buttonTitle="Explore Products"
                    onButtonPress={() => navigation.navigate("Tabs", { screen: "Home" })}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: {
        padding: theme.spacing.xs,
    },
    headerTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
    },
    list: {
        padding: theme.spacing.md,
    },
});
