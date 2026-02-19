import React, { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { StyleSheet, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { notificationService } from "./src/utils/NotificationService";

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    notificationService.initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <AppNavigator />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: '#fff'
  }
})
