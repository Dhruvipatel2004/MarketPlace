import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { Heart, ShoppingCart, Star } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

interface ProductCardProps {
    product: any;
    onPress: () => void;
    onWishlistToggle: () => void;
    isWishlisted: boolean;
    variant?: 'grid' | 'list';
    onAddToCart?: () => void;
}

const { width } = Dimensions.get('window');
const columnWidth = (width - theme.spacing.md * 3) / 2;

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onPress,
    onWishlistToggle,
    isWishlisted,
    variant = 'grid',
    onAddToCart,
}) => {
    const handleWishlistPress = () => {
        onWishlistToggle();
        ReactNativeHapticFeedback.trigger("impactLight", hapticOptions);
    };

    if (variant === 'list') {
        return (
            <TouchableOpacity
                style={styles.listCard}
                activeOpacity={0.8}
                onPress={onPress}
            >
                <View style={styles.listImageContainer}>
                    <Image source={{ uri: product.image }} style={styles.listImage} />
                    {product.rating?.rate > 4.5 && (
                        <View style={styles.bestSellerBadge}>
                            <Text style={styles.bestSellerText}>BEST SELLER</Text>
                        </View>
                    )}
                </View>
                <View style={styles.listContent}>
                    <View>
                        <Text style={styles.categoryText}>{product.category}</Text>
                        <Text style={styles.listTitle} numberOfLines={2}>
                            {product.title}
                        </Text>
                        <View style={styles.ratingRow}>
                            <Star size={12} color={theme.colors.warning} fill={theme.colors.warning} />
                            <Text style={styles.ratingText}>{product.rating?.rate || '4.5'}</Text>
                        </View>
                    </View>

                    <View style={styles.listFooter}>
                        <Text style={styles.listPrice}>${product.price.toFixed(2)}</Text>
                        <View style={styles.listActions}>
                            <TouchableOpacity
                                style={styles.wishlistIconSmall}
                                onPress={handleWishlistPress}
                            >
                                <Heart
                                    size={18}
                                    color={isWishlisted ? theme.colors.error : theme.colors.textSecondary}
                                    fill={isWishlisted ? theme.colors.error : 'transparent'}
                                />
                            </TouchableOpacity>
                            {onAddToCart && (
                                <TouchableOpacity
                                    style={styles.listAddToCartButton}
                                    onPress={() => {
                                        onAddToCart?.();
                                        ReactNativeHapticFeedback.trigger("notificationSuccess", hapticOptions);
                                    }}
                                >
                                    <ShoppingCart size={16} color={theme.colors.white} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={styles.gridCard}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <View style={styles.gridImageContainer}>
                <Image source={{ uri: product.image }} style={styles.gridImage} />
                <TouchableOpacity
                    style={styles.wishlistBadge}
                    onPress={handleWishlistPress}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Heart
                        size={18}
                        color={isWishlisted ? theme.colors.error : theme.colors.textSecondary}
                        fill={isWishlisted ? theme.colors.error : 'transparent'}
                    />
                </TouchableOpacity>
                {product.rating?.rate > 4.5 && (
                    <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>POPULAR</Text>
                    </View>
                )}
            </View>
            <View style={styles.gridInfoContainer}>
                <Text style={styles.categoryText}>{product.category}</Text>
                <Text numberOfLines={2} style={styles.gridTitle}>
                    {product.title}
                </Text>
                <View style={styles.gridFooter}>
                    <Text style={styles.gridPrice}>${product.price.toFixed(2)}</Text>
                    <View style={styles.ratingBadge}>
                        <Star size={10} color={theme.colors.warning} fill={theme.colors.warning} />
                        <Text style={styles.ratingLabel}>{product.rating?.rate || '4.5'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    categoryText: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    // Grid Styles
    gridCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        marginBottom: theme.spacing.md,
        width: columnWidth,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        overflow: 'hidden',
    },
    gridImageContainer: {
        backgroundColor: '#fff',
        padding: theme.spacing.md,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    wishlistBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    popularBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: theme.colors.accent,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    popularBadgeText: {
        fontSize: 8,
        fontWeight: '900',
        color: theme.colors.primary,
    },
    gridImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    gridInfoContainer: {
        padding: theme.spacing.md,
        paddingTop: theme.spacing.sm,
    },
    gridTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        height: 40,
        lineHeight: 20,
    },
    gridFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.sm,
    },
    gridPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: theme.colors.primary,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    ratingLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#D97706',
        marginLeft: 2,
    },

    // List Styles
    listCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    listImageContainer: {
        width: 120,
        height: 120,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: theme.spacing.sm,
        position: 'relative',
    },
    bestSellerBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    bestSellerText: {
        fontSize: 7,
        fontWeight: '900',
        color: theme.colors.white,
    },
    listImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    listContent: {
        flex: 1,
        marginLeft: theme.spacing.md,
        paddingVertical: 4,
        justifyContent: 'space-between',
    },
    listTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.text,
        lineHeight: 22,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginLeft: 4,
        fontWeight: '500',
    },
    listFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listPrice: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.primary,
    },
    listActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    wishlistIconSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listAddToCartButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default React.memo(ProductCard);
