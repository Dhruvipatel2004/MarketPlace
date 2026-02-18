import React, { useCallback, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingCart, ArrowLeft, Heart, Star, User as UserIcon } from 'lucide-react-native';
import { theme } from "../styles/theme";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useReviewStore } from "../store/useReviewStore";
import { useUserStore } from "../store/useUserStore";

export default function ProductDetails({ route, navigation }: any) {
  const { product } = route.params;

  const addToCart = useCartStore((state) => state.addToCart);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const allReviews = useReviewStore((state) => state.reviews);
  const reviews = React.useMemo(() =>
    allReviews.filter(r => r.productId === product.id),
    [allReviews, product.id]
  );
  const addReview = useReviewStore((state) => state.addReview);
  const user = useUserStore((state) => state.user);

  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const isItemWishlisted = wishlist.some(w => w.id === product.id);

  const onAddToCart = useCallback(() => {
    addToCart(product);
  }, [addToCart, product]);

  const handleAddReview = () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to leave a review.", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => navigation.navigate("Login") }
      ]);
      return;
    }

    if (!newComment.trim()) {
      Alert.alert("Error", "Please enter a comment.");
      return;
    }

    addReview({
      productId: product.id,
      userName: user.name || "Anonymous",
      rating: newRating,
      comment: newComment,
    });

    setNewComment("");
    setNewRating(5);
    setIsReviewModalVisible(false);
    Alert.alert("Success", "Review added successfully!");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Tabs", { screen: "Cart" })}
        >
          <ShoppingCart size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
        </View>

        <View style={styles.content}>
          <View style={styles.categoryRow}>
            <Text style={styles.category}>{product.category}</Text>
            <Badge
              label={`★ ${product.rating?.rate || '4.5'} (${product.rating?.count || '120'} reviews)`}
              variant="warning"
            />
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.title}</Text>
            <TouchableOpacity onPress={() => toggleWishlist(product)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Heart
                size={28}
                color={isItemWishlisted ? theme.colors.error : theme.colors.textSecondary}
                fill={isItemWishlisted ? theme.colors.error : "transparent"}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>${product.price ? product.price.toFixed(2) : '0.00'}</Text>

          <Text style={styles.descriptionHeader}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.descriptionHeader}>Customer Reviews ({reviews.length})</Text>
              <TouchableOpacity onPress={() => setIsReviewModalVisible(true)}>
                <Text style={styles.addReviewLink}>Write a Review</Text>
              </TouchableOpacity>
            </View>

            {reviews.length > 0 ? (
              reviews.map((review: any) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewUserRow}>
                    <View style={styles.userAvatar}>
                      <UserIcon size={16} color={theme.colors.primary} />
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{review.userName}</Text>
                      <View style={styles.ratingRow}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            color={s <= review.rating ? "#FFB000" : theme.colors.border}
                            fill={s <= review.rating ? "#FFB000" : "transparent"}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>
                      {new Date(review.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Add to Cart"
          onPress={onAddToCart}
          icon={<ShoppingCart size={20} color={theme.colors.white} />}
          size="large"
          style={styles.addButton}
        />
      </View>

      <Modal
        visible={isReviewModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Write a Review</Text>

            <Text style={styles.label}>Rating</Text>
            <View style={styles.ratingPicker}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setNewRating(s)}>
                  <Star
                    size={32}
                    color={s <= newRating ? "#FFB000" : theme.colors.border}
                    fill={s <= newRating ? "#FFB000" : "transparent"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Your Comment</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Tell us what you think..."
              multiline
              numberOfLines={4}
              value={newComment}
              onChangeText={setNewComment}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setIsReviewModalVisible(false)}
                style={styles.modalButton}
              />
              <Button
                title="Submit"
                onPress={handleAddReview}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 350,
    backgroundColor: '#fff',
    padding: theme.spacing.xl,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  content: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.roundness.xl,
    borderTopRightRadius: theme.roundness.xl,
    marginTop: -30,
    minHeight: 400,
    paddingBottom: 40,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  category: {
    ...theme.typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: theme.colors.textSecondary,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  price: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  descriptionHeader: {
    ...theme.typography.body,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  addButton: {
    width: '100%',
  },
  reviewsSection: {
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  addReviewLink: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  reviewCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reviewUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...theme.typography.body,
    fontWeight: '600',
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  reviewDate: {
    ...theme.typography.caption,
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  reviewComment: {
    ...theme.typography.body,
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  noReviews: {
    ...theme.typography.caption,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness.lg,
    padding: theme.spacing.xl,
  },
  modalTitle: {
    ...theme.typography.h2,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  ratingPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness.md,
    padding: theme.spacing.md,
    height: 120,
    textAlignVertical: 'top',
    ...theme.typography.body,
    marginBottom: theme.spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});
