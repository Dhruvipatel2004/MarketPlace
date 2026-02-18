import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { Heart, ShoppingCart } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import Badge from './Badge';
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
    if (variant === 'list') {
        return (
            <TouchableOpacity
                style={styles.listCard}
                activeOpacity={0.9}
                onPress={onPress}
            >
                <View style={styles.listImageContainer}>
                    <Image source={{ uri: product.image }} style={styles.listImage} />
                </View>
                <View style={styles.listContent}>
                    <Text style={styles.listTitle} numberOfLines={2}>
                        {product.title}
                    </Text>
                    <Text style={styles.listPrice}>${product.price.toFixed(2)}</Text>

                    <View style={styles.listActions}>
                        {onAddToCart && (
                            <TouchableOpacity
                                style={styles.listAddToCartButton}
                                onPress={() => {
                                    onAddToCart?.();
                                    ReactNativeHapticFeedback.trigger("impactLight", hapticOptions);
                                }}
                            >
                                <ShoppingCart size={18} color={theme.colors.white} />
                                <Text style={styles.listAddToCartText}>Add to Cart</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.listRemoveButton} onPress={onWishlistToggle}>
                            <Heart
                                size={20}
                                color={theme.colors.error}
                                fill={isWishlisted ? theme.colors.error : 'transparent'}
                            />
                        </TouchableOpacity>
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
                <TouchableOpacity style={styles.wishlistBadge} onPress={onWishlistToggle}>
                    <Heart
                        size={18}
                        color={isWishlisted ? theme.colors.error : theme.colors.textSecondary}
                        fill={isWishlisted ? theme.colors.error : 'transparent'}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.gridInfoContainer}>
                <Text numberOfLines={2} style={styles.gridTitle}>
                    {product.title}
                </Text>
                <View style={styles.gridPriceRow}>
                    <Text style={styles.gridPrice}>${product.price.toFixed(2)}</Text>
                    <Badge
                        label={`★ ${product.rating?.rate || '4.5'}`}
                        variant="warning"
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    // Grid Styles
    gridCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        marginBottom: theme.spacing.md,
        width: columnWidth,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    gridImageContainer: {
        backgroundColor: '#fff',
        padding: theme.spacing.md,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    wishlistBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 6,
        borderRadius: 20,
        zIndex: 1,
    },
    gridImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    gridInfoContainer: {
        padding: theme.spacing.sm,
    },
    gridTitle: {
        ...theme.typography.caption,
        fontWeight: '600',
        color: theme.colors.text,
        height: 36,
        lineHeight: 18,
    },
    gridPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.xs,
    },
    gridPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },

    // List Styles
    listCard: {
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
    listImageContainer: {
        width: 100,
        height: 100,
        backgroundColor: '#fff',
        borderRadius: theme.roundness.md,
        padding: 5,
    },
    listImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    listContent: {
        flex: 1,
        marginLeft: theme.spacing.md,
        justifyContent: 'space-between',
    },
    listTitle: {
        ...theme.typography.body,
        fontWeight: '600',
        color: theme.colors.text,
    },
    listPrice: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        fontSize: 18,
    },
    listActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: theme.spacing.sm,
    },
    listAddToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: theme.roundness.md,
    },
    listAddToCartText: {
        color: theme.colors.white,
        marginLeft: 6,
        fontSize: 12,
        fontWeight: 'bold',
    },
    listRemoveButton: {
        padding: 5,
    },
});

export default React.memo(ProductCard);
