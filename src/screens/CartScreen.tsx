import React, { useCallback, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Alert
} from "react-native";
import { Trash2, ShoppingBag } from 'lucide-react-native';
import CustomHeader from "../components/CustomHeader";
import { theme } from "../styles/theme";
import Button from "../components/common/Button";
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
        <Text numberOfLines={1} style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

        <QuantitySelector
          quantity={item.quantity}
          onIncrease={() => onUpdateQuantity(item.id, 1)}
          onDecrease={() => onUpdateQuantity(item.id, -1)}
        />
      </View>

      <Button
        variant="text"
        title=""
        icon={<Trash2 size={20} color={theme.colors.error} />}
        onPress={handleRemove}
        style={styles.removeButton}
      />
    </View>
  );
});

export default function CartScreen({ navigation }: any) {
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const totalPrice = useCartStore((state) => state.totalPrice);

  const subtotal = useMemo(() => totalPrice, [totalPrice]);

  const renderCartItem = useCallback(({ item }: { item: any }) => (
    <CartItem
      item={item}
      onUpdateQuantity={updateQuantity}
      onRemove={removeFromCart}
    />
  ), [updateQuantity, removeFromCart]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <CustomHeader title="Shopping Cart" />

      {cart.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={80} color={theme.colors.border} />}
          title="Your cart is empty"
          subtitle="Looks like you haven't added anything to your cart yet."
          buttonTitle="Start Shopping"
          onButtonPress={() => navigation.navigate("Tabs", { screen: "Home" })}
        />
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={renderCartItem}
            removeClippedSubviews={true}
          />

          <View style={styles.footer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
            </View>

            <Button
              title="Proceed to Checkout"
              onPress={() => navigation.navigate("Checkout")}
              style={styles.checkoutButton}
              size="large"
            />
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
    marginBottom: theme.spacing.xs,
  },
  removeButton: {
    padding: theme.spacing.sm,
    minHeight: 40,
    minWidth: 40,
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
    width: '100%',
  },
});
