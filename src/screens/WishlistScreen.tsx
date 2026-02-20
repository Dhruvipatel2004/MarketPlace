/* eslint-disable react-native/no-inline-styles */
import React, { useCallback } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar
} from 'react-native';
import { ArrowLeft, Heart  } from 'lucide-react-native';
import { theme } from '../styles/theme';
import ProductCard from '../components/common/ProductCard';
import EmptyState from '../components/common/EmptyState';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WishlistScreen({ navigation }: any) {
    const wishlist = useWishlistStore((state) => state.wishlist);
    const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
    const addToCart = useCartStore((state) => state.addToCart);

    const renderItem = useCallback(({ item }: { item: any }) => (
        <View style={styles.cardContainer}>
            <ProductCard
                product={item}
                onPress={() => navigation.navigate("Details", { product: item })}
                onWishlistToggle={() => toggleWishlist(item)}
                isWishlisted={wishlist.some(w => w.id === item.id)}
                variant="list"
                onAddToCart={() => addToCart(item)}
            />
        </View>
    ), [navigation, toggleWishlist, wishlist, addToCart]);

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={22} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Wishlist</Text>
                    <View style={{ width: 44 }} />
                </View>

                {wishlist.length > 0 ? (
                    <FlatList
                        data={wishlist}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={true}
                        initialNumToRender={8}
                    />
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <EmptyState
                            icon={<Heart size={80} color={theme.colors.border} />}
                            title="Your Wishlist is Empty"
                            subtitle="Save items that you like for later and get notified when they're on sale!"
                            buttonTitle="Start Exploring"
                            onButtonPress={() => navigation.navigate("Home")}
                        />
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.white,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h2,
        fontSize: 20,
    },
    list: {
        padding: theme.spacing.lg,
        paddingBottom: 40,
    },
    cardContainer: {
        marginBottom: theme.spacing.md,
    }
});
