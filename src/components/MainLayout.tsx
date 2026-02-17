import React, { useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback,} from "react-native";
import CustomDrawer from "./CustomDrawer";
import Header from "./Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../styles/theme";

// const { width } = Dimensions.get('window');

export default function MainLayout({ children, navigation }: any) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header toggleDrawer={toggleDrawer} />
        {children}
      </View>

      {drawerOpen && (
        <>
          <TouchableWithoutFeedback onPress={closeDrawer}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          <View style={styles.drawerWrapper}>
            <CustomDrawer
              navigation={navigation}
              closeDrawer={closeDrawer}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99,
  },
  drawerWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    zIndex: 100,
    backgroundColor: theme.colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
});
