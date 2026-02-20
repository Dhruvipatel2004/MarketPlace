import React, { useCallback, useMemo } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingCart, ArrowLeft, Heart, Star, User as UserIcon, Share2, ShieldCheck } from 'lucide-react-native';
import { theme } from "../styles/theme";
import Button from "../components/common/Button";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useReviewStore } from "../store/useReviewStore";

const { width } = Dimensions.get('window');

export default function ProductDetails({ route, navigation }: any) {
  const product = route.params?.product;

  // ── All hooks must be called unconditionally, before any early return ──
  const cart = useCartStore((state) => state.cart);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const addToCart = useCartStore((state) => state.addToCart);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const allReviews = useReviewStore((state) => state.reviews);
  const reviews = useMemo(() =>
    product ? allReviews.filter(r => r.productId === product.id) : [],
    [allReviews, product]
  );

  const isItemWishlisted = product ? wishlist.some(w => w.id === product.id) : false;

  const onAddToCart = useCallback(() => {
    if (product) addToCart(product);
  }, [addToCart, product]);


  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Product not found</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Floating Header */}
      <SafeAreaView style={styles.floatingHeader} edges={['top']}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={22} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Share2 size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.navigate("Tabs", { screen: "Cart" })}
          >
            <ShoppingCart size={20} color={theme.colors.text} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image source={{ uri: product.image }} style={styles.mainImage} />
          <TouchableOpacity
            style={styles.wishlistCircle}
            onPress={() => toggleWishlist(product)}
          >
            <Heart
              size={24}
              color={isItemWishlisted ? theme.colors.error : theme.colors.textSecondary}
              fill={isItemWishlisted ? theme.colors.error : "transparent"}
            />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.dragIndicator} />

          <View style={styles.categoryRow}>
            <Text style={styles.categoryTag}>{product.category}</Text>
            <View style={styles.ratingBox}>
              <Star size={14} color={theme.colors.warning} fill={theme.colors.warning} />
              <Text style={styles.ratingValue}>{product.rating?.rate || '4.5'}</Text>
              <Text style={styles.ratingCount}>({product.rating?.count || '120'})</Text>
            </View>
          </View>

          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productPrice}>${product?.price ? product.price.toFixed(2) : '0.00'}</Text>

          {/* Features/Guarantees */}
          <View style={styles.guaranteeRow}>
            <View style={styles.guaranteeItem}>
              <ShieldCheck size={18} color={theme.colors.success} />
              <Text style={styles.guaranteeText}>Authentic Product</Text>
            </View>
            <View style={styles.guaranteeItem}>
              <ShieldCheck size={18} color={theme.colors.success} />
              <Text style={styles.guaranteeText}>15 Days Return</Text>
            </View>
          </View>

          <View style={styles.sectionDivider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>

          <View style={styles.sectionDivider} />

          {/* Reviews Section */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllBtn}>View All</Text>
            </TouchableOpacity>
          </View>

          {reviews.length > 0 ? (
            reviews.slice(0, 3).map((review: any) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <View style={styles.userCircle}>
                    <UserIcon size={14} color={theme.colors.primary} />
                  </View>
                  <View style={styles.reviewUserInfo}>
                    <Text style={styles.reviewerName}>{review.userName}</Text>
                    <View style={styles.starRow}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={10}
                          color={s <= review.rating ? theme.colors.warning : '#E5E7EB'}
                          fill={s <= review.rating ? theme.colors.warning : "transparent"}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewDate}>
                    {new Date(review.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.reviewText}>{review.comment}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyReviews}>
              <Text style={styles.emptyReviewText}>No reviews yet. Be the first to share your experience!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modern Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Button
          title="Add to Cart"
          onPress={onAddToCart}
          style={styles.mainActionBtn}
          size="large"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    ...theme.typography.body,
    marginBottom: theme.spacing.md,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.white,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  imageSection: {
    width: width,
    height: width * 1.1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  wishlistCircle: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  contentSection: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -30,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryTag: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginLeft: 6,
  },
  ratingCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  productTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text,
    lineHeight: 32,
    marginBottom: theme.spacing.xs,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  guaranteeRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: theme.spacing.lg,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guaranteeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  descriptionText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    fontWeight: '400',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  viewAllBtn: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  reviewCard: {
    marginBottom: theme.spacing.lg,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  starRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  reviewText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  emptyReviews: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyReviewText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 34, // Safe area
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  messageBtn: {
    width: 60,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  mainActionBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
  },
});
