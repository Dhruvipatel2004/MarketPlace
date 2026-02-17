import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView
} from 'react-native';
import { Heart, ShoppingCart, ArrowLeft, ArchiveX } from 'lucide-react-native';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { theme } from '../styles/theme';

export default function WishlistScreen({ navigation }: any) {
    const { wishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("Details", { product: item })}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={() => addToCart(item)}
                    >
                        <ShoppingCart size={18} color={theme.colors.white} />
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => toggleWishlist(item)}
                    >
                        <Heart size={20} color={theme.colors.error} fill={theme.colors.error} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

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
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <ArchiveX size={80} color={theme.colors.border} />
                    <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
                    <Text style={styles.emptySubtitle}>Save items that you like for later!</Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => navigation.navigate("Home")}
                    >
                        <Text style={styles.shopButtonText}>Explore Products</Text>
                    </TouchableOpacity>
                </View>
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
    card: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        backgroundColor: '#fff',
        borderRadius: theme.roundness.md,
    },
    content: {
        flex: 1,
        marginLeft: theme.spacing.md,
        justifyContent: 'space-between',
    },
    title: {
        ...theme.typography.body,
        fontWeight: '600',
        color: theme.colors.text,
    },
    price: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        fontSize: 18,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: theme.spacing.sm,
    },
    addToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: theme.roundness.md,
    },
    addToCartText: {
        color: theme.colors.white,
        marginLeft: 6,
        fontSize: 12,
        fontWeight: 'bold',
    },
    removeButton: {
        padding: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    emptyTitle: {
        ...theme.typography.h2,
        marginTop: theme.spacing.lg,
        color: theme.colors.text,
    },
    emptySubtitle: {
        ...theme.typography.caption,
        marginTop: theme.spacing.xs,
        textAlign: 'center',
    },
    shopButton: {
        marginTop: theme.spacing.xl,
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.roundness.md,
    },
    shopButtonText: {
        color: theme.colors.white,
        fontWeight: 'bold',
    }
});
