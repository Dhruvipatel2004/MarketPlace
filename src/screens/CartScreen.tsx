/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  StatusBar
} from "react-native";
import { Trash2, ShoppingBag, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { theme } from "../styles/theme";
import EmptyState from "../components/common/EmptyState";
import QuantitySelector from "../components/common/QuantitySelector";
import { useCartStore } from "../store/useCartStore";

interface CartItemProps {
  item: any;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

const CartItem = React.memo(({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const handleRemove = () => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => onRemove(item.id) }
      ]
    );
  };

  return (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      </View>

      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text numberOfLines={1} style={styles.itemTitle}>{item.title}</Text>
          <TouchableOpacity onPress={handleRemove} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Trash2 size={18} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
        <Text style={styles.itemCategory}>{item.category}</Text>

        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => onUpdateQuantity(item.id, 1)}
            onDecrease={() => onUpdateQuantity(item.id, -1)}
          />
        </View>
      </View>
    </View>
  );
});

export default function CartScreen({ navigation }: any) {
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const totalPrice = useCartStore((state) => state.totalPrice);

  const subtotal = useMemo(() => totalPrice, [totalPrice]);
  const shipping = 0; // Free shipping for premium experience
  const tax = subtotal * 0.08; // 8% conceptual tax
  const finalTotal = subtotal + shipping + tax;

  const renderCartItem = useCallback(({ item }: { item: any }) => (
    <CartItem
      item={item}
      onUpdateQuantity={updateQuantity}
      onRemove={removeFromCart}
    />
  ), [updateQuantity, removeFromCart]);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Shopping Cart</Text>
              <Text style={styles.headerSubtitle}>{cart.length} items</Text>
            </View>
          </View>
        </View>

        {cart.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <EmptyState
              icon={<ShoppingBag size={80} color={theme.colors.border} />}
              title="Your cart is empty"
              subtitle="Looks like you haven't added anything to your cart yet."
              buttonTitle="Start Shopping"
              onButtonPress={() => navigation.navigate("Home")}
            />
          </View>
        ) : (
          <>
            <FlatList
              data={cart}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              renderItem={renderCartItem}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
            />

            <View style={styles.footer}>
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Estimated Tax (8%)</Text>
                  <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Shipping</Text>
                  <Text style={[styles.summaryValue, { color: theme.colors.success }]}>FREE</Text>
                </View>
              </View>

              <View style={styles.totalRow}>
                <View>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() => navigation.navigate("Checkout")}
                >
                  <Text style={styles.checkoutBtnText}>Checkout</Text>
                  <ChevronRight size={20} color={theme.colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </>
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
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.h1,
    fontSize: 24,
  },
  headerSubtitle: {
    ...theme.typography.caption,
    marginTop: -2,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  itemImageContainer: {
    width: 90,
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  itemInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    width: '85%',
  },
  itemCategory: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  footer: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 20,
  },
  summaryContainer: {
    gap: 12,
    marginBottom: theme.spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  totalLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  totalValue: {
    ...theme.typography.h2,
    color: theme.colors.text,
    fontSize: 26,
  },
  checkoutBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    height: 56,
    borderRadius: 16,
    gap: 8,
  },
  checkoutBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
