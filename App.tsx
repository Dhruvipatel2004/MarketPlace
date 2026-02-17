import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { StyleSheet, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
  <AppNavigator  />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: '#fff'
  }
})
