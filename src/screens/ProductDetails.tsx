import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingCart, Star, ArrowLeft, Heart } from 'lucide-react-native';
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { theme } from "../styles/theme";

export default function ProductDetails({ route, navigation }: any) {
  const { product } = route.params;
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const handleAddToCart = () => {
    addToCart(product);
    if (Platform.OS === 'android') {
      ToastAndroid.show("Added to cart!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Success", "Added to cart!");
    }
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
        </View>

        <View style={styles.content}>
          <View style={styles.categoryRow}>
            <Text style={styles.category}>{product.category}</Text>
            <View style={styles.ratingRow}>
              <Star size={16} color="#FFB800" fill="#FFB800" />
              <Text style={styles.ratingText}>{product.rating?.rate || '4.5'} ({product.rating?.count || '120'} reviews)</Text>
            </View>
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.title}</Text>
            <TouchableOpacity onPress={() => toggleWishlist(product)}>
              <Heart
                size={28}
                color={isWishlisted(product.id) ? theme.colors.error : theme.colors.textSecondary}
                fill={isWishlisted(product.id) ? theme.colors.error : "transparent"}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>${product.price ? product.price.toFixed(2) : '0.00'}</Text>

          <Text style={styles.descriptionHeader}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <ShoppingCart size={20} color={theme.colors.white} />
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
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
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: theme.colors.white,
    marginLeft: theme.spacing.sm,
    ...theme.typography.button,
  },
});
