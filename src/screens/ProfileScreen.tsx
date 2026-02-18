import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { LogOut, User as UserIcon, Settings, Heart, ShoppingBag, ChevronRight } from 'lucide-react-native';
import MainLayout from "../components/MainLayout";
import { theme } from "../styles/theme";
import Button from "../components/common/Button";
import { useUserStore } from "../store/useUserStore";

export default function ProfileScreen({ navigation }: any) {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logout();
          }
        }
      ]
    );
  }, [logout]);

  const renderOption = (icon: any, label: string, onPress?: () => void) => (
    <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.optionLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.optionLabel}>{label}</Text>
      </View>
      <ChevronRight size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <MainLayout navigation={navigation}>
      <View style={styles.container}>
        <Text style={styles.title}>My Profile</Text>

        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <UserIcon size={40} color={theme.colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            {user ? (
              <>
                <Text style={styles.userName}>Hello, {user.name || 'User'}</Text>
                <Text style={styles.userEmail}>{user.email || 'user@example.com'}</Text>
              </>
            ) : (
              <>
                <Text style={styles.userName}>Welcome Guest</Text>
                <Text style={styles.userEmail}>Sign in to manage your account</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {user ? (
            <>
              {renderOption(<ShoppingBag size={20} color={theme.colors.primary} />, "My Orders", () => navigation.navigate("Orders"))}
              {renderOption(<Heart size={20} color={theme.colors.primary} />, "Wishlist", () => navigation.navigate("Wishlist"))}
              {renderOption(<Settings size={20} color={theme.colors.primary} />, "Settings")}
              <TouchableOpacity style={[styles.option, styles.logoutOption]} onPress={handleLogout}>
                <View style={styles.optionLeft}>
                  <View style={[styles.iconContainer, styles.logoutIconContainer]}>
                    <LogOut size={20} color={theme.colors.error} />
                  </View>
                  <Text style={[styles.optionLabel, styles.logoutLabel]}>Logout</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.authContainer}>
              <Button
                title="Login"
                onPress={() => navigation.navigate("Login")}
                style={styles.loginButton}
                size="large"
              />

              <Button
                title="Create Account"
                variant="outline"
                onPress={() => navigation.navigate("Signup")}
                size="large"
              />
            </View>
          )}
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.roundness.lg,
    marginBottom: theme.spacing.xl,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  profileInfo: {
    marginLeft: theme.spacing.md,
  },
  userName: {
    ...theme.typography.h2,
    fontSize: 18,
    color: theme.colors.text,
  },
  userEmail: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  optionsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness.lg,
    overflow: 'hidden',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  optionLabel: {
    ...theme.typography.body,
    fontSize: 15,
    color: theme.colors.text,
  },
  logoutOption: {
    borderBottomWidth: 0,
  },
  logoutIconContainer: {
    backgroundColor: '#FFF2F0',
  },
  logoutLabel: {
    color: theme.colors.error,
    fontWeight: 'bold',
  },
  authContainer: {
    padding: theme.spacing.md,
  },
  loginButton: {
    marginBottom: theme.spacing.md,
  },
});
