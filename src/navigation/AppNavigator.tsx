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

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
