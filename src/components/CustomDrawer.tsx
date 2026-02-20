import { Home, ShoppingCart, User, X, LogOut, Heart, Package, Settings, HelpCircle } from "lucide-react-native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../styles/theme";
import LinearGradient from "react-native-linear-gradient";
import { useUserStore } from "../store/useUserStore";

export default function CustomDrawer({ navigation, closeDrawer }: any) {
  const user = useUserStore((state) => state.user);

  const navigateTo = (screen: string) => {
    if (screen === "Cart" || screen === "Home" || screen === "Profile") {
      navigation.navigate("Tabs", { screen: screen });
    } else {
      navigation.navigate(screen);
    }
    closeDrawer();
  };

  const renderMenuItem = (icon: any, label: string, screen: string, color: string = theme.colors.primary) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo(screen)}>
      <View style={[styles.menuIconContainer, { backgroundColor: color + '10' }]}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 20, color })}
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, '#283593']}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerTop}>
            <Text style={styles.brandTitle}>MarketPlace</Text>
            <TouchableOpacity onPress={closeDrawer} style={styles.closeIcon}>
              <X size={24} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.userSection}>
            <View style={styles.userAvatar}>
              <User size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || "Welcome Guest"}</Text>
              <Text style={styles.userStatus}>{user ? "Premium Member" : "Sign in to your account"}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Main Menu</Text>
        {renderMenuItem(<Home />, "Home", "Home")}
        {renderMenuItem(<ShoppingCart />, "My Cart", "Cart", "#6366F1")}
        {renderMenuItem(<Heart />, "Wishlist", "Wishlist", "#EC4899")}
        {renderMenuItem(<Package />, "My Orders", "Orders", "#10B981")}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Account</Text>
        {renderMenuItem(<User />, "My Profile", "Profile", "#8B5CF6")}
        {renderMenuItem(<Settings />, "Settings", "Settings", "#6B7280")}
        {renderMenuItem(<HelpCircle />, "Help & Support", "Support", "#F59E0B")}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton}>
          <View style={styles.logoutIconCircle}>
            <LogOut size={18} color={theme.colors.error} />
          </View>
          <Text style={styles.logoutLabel}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.white,
    letterSpacing: 1,
  },
  closeIcon: {
    padding: 4,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 14,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.white,
  },
  userStatus: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  menuContainer: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 20,
  },
  footer: {
    padding: theme.spacing.xl,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.error + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.error,
  },
  versionText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '500',
  }
});
