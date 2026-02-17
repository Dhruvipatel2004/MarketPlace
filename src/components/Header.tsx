import { Menu } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../styles/theme";

export default function Header({ toggleDrawer }: any) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
        <Menu size={24} color={theme.colors.white} />
      </TouchableOpacity>
      <Text style={styles.logo}>MiniMarket</Text>
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
});
