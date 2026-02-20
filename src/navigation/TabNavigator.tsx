/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from "react";
import { Platform, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import { Home, ShoppingCart, User } from "lucide-react-native";
import ProfileScreen from "../screens/ProfileScreen";
import { useCartStore } from "../store/useCartStore";
import { theme } from "../styles/theme";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const cart = useCartStore((state) => state.cart);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 12,
          left: 20,
          right: 20,
          elevation: 10,
          backgroundColor: theme.colors.white,
          borderRadius: 24,
          height: 70,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          paddingBottom: Platform.OS === 'ios' ? 20 : 12,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarIcon: ({ color, focused }) => {
          let icon;
          if (route.name === "Home") {
            icon = <Home color={color} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} />;
          } else if (route.name === "Cart") {
            icon = <ShoppingCart color={color} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} />;
          } else if (route.name === "Profile") {
            icon = <User color={color} size={focused ? 24 : 22} strokeWidth={focused ? 2.5 : 2} />;
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              {icon}
              {focused && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.colors.primary, marginTop: 4 }} />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.primary,
            color: theme.colors.white,
            fontSize: 10,
            fontWeight: '900',
            marginTop: Platform.OS === 'ios' ? -2 : 0,
          }
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarStyle: { display: 'none' }
        }}
      />
    </Tab.Navigator>
  );
}
