/* eslint-disable react-native/no-inline-styles */
import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView, StatusBar } from "react-native";
import { LogOut, User as UserIcon, Settings, Heart, ShoppingBag, ChevronRight, Camera as CameraIcon, ShieldCheck, HelpCircle, Bell } from 'lucide-react-native';
import MainLayout from "../components/MainLayout";
import { theme } from "../styles/theme";
import Button from "../components/common/Button";
import { useUserStore } from "../store/useUserStore";
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from "react-native-linear-gradient";

export default function ProfileScreen({ navigation }: any) {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const updateProfileImage = useUserStore((state) => state.updateProfileImage);

  const route = (navigation as any).getState().routes.find((r: any) => r.name === 'Profile');
  const capturedImage = route?.params?.capturedImage;

  React.useEffect(() => {
    if (capturedImage) {
      updateProfileImage(capturedImage);
      navigation.setParams({ capturedImage: undefined });
    }
  }, [capturedImage, updateProfileImage, navigation]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout from your premium account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => logout()
        }
      ]
    );
  }, [logout]);

  const handleImagePick = () => {
    Alert.alert(
      "Update Profile Photo",
      "Choose a source",
      [
        {
          text: "Camera",
          onPress: () => navigation.navigate("Camera", { source: 'profile' })
        },
        {
          text: "Gallery",
          onPress: async () => {
            const result = await launchImageLibrary({
              mediaType: 'photo',
              quality: 0.8,
            });
            if (result.assets && result.assets[0].uri) {
              updateProfileImage(result.assets[0].uri);
            }
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const renderOption = (icon: any, label: string, color: string, onPress?: () => void) => (
    <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.optionLeft}>
        <View style={[styles.iconContainer, { backgroundColor: color + '10' }]}>
          {React.cloneElement(icon as React.ReactElement<any>, { color })}
        </View>
        <Text style={styles.optionLabel}>{label}</Text>
      </View>
      <ChevronRight size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <MainLayout navigation={navigation}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[theme.colors.primary, '#283593']}
          style={styles.profileHeader}
        >
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={user ? handleImagePick : undefined}
          >
            <View style={styles.avatarStroke}>
              {user?.profileImage ? (
                <Image source={{ uri: user.profileImage }} style={styles.avatarImage} />
              ) : (
                <View style={styles.placeholderAvatar}>
                  <UserIcon size={32} color={theme.colors.primary} />
                </View>
              )}
            </View>
            {user && (
              <View style={[styles.cameraBadge, { backgroundColor: theme.colors.accent }]}>
                <CameraIcon size={12} color={theme.colors.primary} />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.userBasicInfo}>
            {user ? (
              <>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.premiumBadge}>
                  <ShieldCheck size={12} color={theme.colors.primary} />
                  <Text style={styles.premiumText}>Premium Member</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.userName}>Welcome Guest</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}>Sign in to your account</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {user ? (
            <>
              <Text style={styles.sectionHeader}>Activity</Text>
              <View style={styles.optionsCard}>
                {renderOption(<ShoppingBag size={20} />, "My Orders", theme.colors.primary, () => navigation.navigate("Orders"))}
                {renderOption(<Heart size={20} />, "Wishlist", "#EC4899", () => navigation.navigate("Wishlist"))}
                {renderOption(<Bell size={20} />, "Notifications", "#F59E0B")}
              </View>

              <Text style={styles.sectionHeader}>Account Settings</Text>
              <View style={styles.optionsCard}>
                {renderOption(<UserIcon size={20} />, "Profile Details", theme.colors.primary)}
                {renderOption(<Settings size={20} />, "Preferences", "#6B7280", () => navigation.navigate("Settings"))}
                {renderOption(<ShieldCheck size={20} />, "Security", theme.colors.success)}
              </View>

              <Text style={styles.sectionHeader}>Support</Text>
              <View style={styles.optionsCard}>
                {renderOption(<HelpCircle size={20} />, "Help Center", theme.colors.primary)}
                <TouchableOpacity style={[styles.option, { borderBottomWidth: 0 }]} onPress={handleLogout}>
                  <View style={styles.optionLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.error + '10' }]}>
                      <LogOut size={20} color={theme.colors.error} />
                    </View>
                    <Text style={[styles.optionLabel, { color: theme.colors.error, fontWeight: '700' }]}>Logout</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.authEmptyState}>
              <ShoppingBag size={64} color="#E5E7EB" />
              <Text style={styles.authTitle}>Manage your shopping better</Text>
              <Text style={styles.authSubtitle}>Sign in to track orders, manage wishlist and more.</Text>
              <Button
                title="Sign In Now"
                onPress={() => navigation.navigate("Login")}
                style={styles.authBtn}
                size="large"
              />
            </View>
          )}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileHeader: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarStroke: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: theme.colors.white,
  },
  placeholderAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#283593',
  },
  userBasicInfo: {
    marginLeft: theme.spacing.lg,
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.white,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 4,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '900',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  loginLink: {
    fontSize: 14,
    color: theme.colors.accent,
    fontWeight: '600',
    marginTop: 4,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginLeft: 4,
  },
  optionsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: '600',
  },
  authEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 20,
  },
  authSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  authBtn: {
    marginTop: 30,
    width: '80%',
    borderRadius: 16,
  }
});
