import { Home, ShoppingCart, User, X, LogOut, Heart, Package } from "lucide-react-native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { theme } from "../styles/theme";

export default function CustomDrawer({ navigation, closeDrawer }: any) {
  const navigateTo = (screen: string) => {
    if (screen === "Cart" || screen === "Home" || screen === "Profile") {
      navigation.navigate("Tabs", { screen: screen });
    } else {
      navigation.navigate(screen);
    }
    closeDrawer();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MiniMarket</Text>
        <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
          <X size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Home")}>
          <Home size={20} color={theme.colors.textSecondary} />
          <Text style={styles.menuLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Cart")}>
          <ShoppingCart size={20} color={theme.colors.textSecondary} />
          <Text style={styles.menuLabel}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Wishlist")}>
          <Heart size={20} color={theme.colors.textSecondary} />
          <Text style={styles.menuLabel}>Wishlist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Orders")}>
          <Package size={20} color={theme.colors.textSecondary} />
          <Text style={styles.menuLabel}>My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Profile")}>
          <User size={20} color={theme.colors.textSecondary} />
          <Text style={styles.menuLabel}>Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color={theme.colors.error} />
          <Text style={styles.logoutLabel}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.h1,
    fontSize: 24,
    color: theme.colors.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  menuContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.roundness.md,
    marginBottom: theme.spacing.sm,
  },
  menuLabel: {
    ...theme.typography.body,
    marginLeft: theme.spacing.md,
    color: theme.colors.text,
    fontWeight: '500',
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  logoutLabel: {
    ...theme.typography.body,
    marginLeft: theme.spacing.md,
    color: theme.colors.error,
    fontWeight: 'bold',
  },
});
