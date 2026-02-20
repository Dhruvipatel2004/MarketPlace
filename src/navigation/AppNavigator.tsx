import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductDetails from "../screens/ProductDetails";
import TabNavigator from "./TabNavigator";
import CheckoutScreen from "../screens/CheckoutScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import OrdersScreen from "../screens/OrdersScreen";
import WishlistScreen from "../screens/WishlistScreen";
import CameraScreen from "../screens/CameraScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SplashScreen from "../screens/SplashScreen";

import notifee, { EventType } from "@notifee/react-native";
import { Linking } from "react-native";

const Stack = createNativeStackNavigator();

const linking: any = {
  prefixes: ["marketplace://"],
  config: {
    screens: {
      Splash: "splash",
      Tabs: {
        screens: {
          Home: "home",
          Cart: "cart",
          Profile: "profile",
        },
      },
      Details: "details/:id",
      Orders: "orders",
      OrderDetail: "order-detail/:id",
    },
  },
  async getInitialURL() {
    // Check if the app was opened from a notification
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification && initialNotification.notification.data?.screen) {
      const screen = initialNotification.notification.data.screen;
      const id = initialNotification.notification.data.id;
      if (screen === 'OrderDetail' && id) {
        return `marketplace://order-detail/${id}`;
      }
      return `marketplace://${screen.toString().toLowerCase()}`;
    }
    // Fallback to standard deep link
    return Linking.getInitialURL();
  },
  subscribe(listener: any) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);
    const subscription = Linking.addEventListener("url", onReceiveURL);

    // Listen for Notifee foreground events
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification?.data?.screen) {
        const screen = detail.notification.data.screen;
        const id = detail.notification.data.id;
        if (screen === 'OrderDetail' && id) {
          listener(`marketplace://order-detail/${id}`);
        } else {
          listener(`marketplace://${screen.toString().toLowerCase()}`);
        }
      }
    });

    return () => {
      subscription.remove();
      unsubscribeNotifee();
    };
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
        />
        <Stack.Screen
          name="Details"
          component={ProductDetails}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
        />
        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
        />
        <Stack.Screen
          name="Wishlist"
          component={WishlistScreen}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
        />
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
