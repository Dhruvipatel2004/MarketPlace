import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react-native';
import CustomHeader from "../components/CustomHeader";
import { useCart } from "../context/CartContext";
import { theme } from "../styles/theme";

export default function CartScreen({ navigation }: any) {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <ShoppingBag size={80} color={theme.colors.border} />
      </View>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>Looks like you haven't added anything to your cart yet.</Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      </View>

      <View style={styles.itemInfo}>
        <Text numberOfLines={1} style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, -1)}
            style={styles.quantityButton}
          >
            <Minus size={16} color={theme.colors.text} />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity
            onPress={() => updateQuantity(item.id, 1)}
            style={styles.quantityButton}
          >
            <Plus size={16} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Remove", style: "destructive", onPress: () => removeFromCart(item.id) }
            ]
          );
        }}
        style={styles.removeButton}
      >
        <Trash2 size={20} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <CustomHeader title="Shopping Cart" />

      {cart.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={renderCartItem}
          />

          <View style={styles.footer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate("Checkout")}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness.lg,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: theme.roundness.md,
    padding: 5,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  itemInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  itemTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  itemPrice: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness.sm,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    padding: 6,
  },
  quantityText: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  removeButton: {
    padding: theme.spacing.sm,
  },
  footer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderTopLeftRadius: theme.roundness.xl,
    borderTopRightRadius: theme.roundness.xl,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  summaryLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  totalLabel: {
    ...theme.typography.body,
    fontWeight: 'bold',
  },
  totalValue: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  checkoutText: {
    color: theme.colors.white,
    ...theme.typography.button,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyIconContainer: {
    width: 150,
    height: 150,
    backgroundColor: theme.colors.surface,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    ...theme.typography.caption,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  shopButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: theme.roundness.full,
  },
  shopButtonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  }
});
