import { Menu, ShoppingCart } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCartStore } from "../store/useCartStore";
import { theme } from "../styles/theme";

export default function Header({ toggleDrawer }: any) {
  const navigation = useNavigation<any>();
  const cart = useCartStore((state) => state.cart);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
        <Menu size={24} color={theme.colors.white} />
      </TouchableOpacity>
      <Text style={styles.logo}>MiniMarket</Text>
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        onPress={() => navigation.navigate("Tabs", { screen: "Cart" })}
        style={styles.cartButton}
      >
        <ShoppingCart size={24} color={theme.colors.white} />
        {cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  menuButton: {
    marginRight: theme.spacing.lg,
  },
  logo: {
    ...theme.typography.h2,
    color: theme.colors.white,
    letterSpacing: 0.5,
  },
  cartButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.error,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
});
