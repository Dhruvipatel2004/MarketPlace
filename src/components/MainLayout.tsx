import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Platform, StatusBar } from "react-native";
import CustomDrawer from "./CustomDrawer";
import Header from "./Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../styles/theme";

// const { width } = Dimensions.get('window');

export default function MainLayout({ children, navigation }: any) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    const state = navigation.getState();
    const currentRoute = state?.routes[state.index]?.name;
    const isHomeScreen = currentRoute === 'Home';

    navigation.setOptions({
      tabBarStyle: {
        display: (drawerOpen || !isHomeScreen) ? 'none' : 'flex',
        // Preserve common styles
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
    });
  }, [drawerOpen, navigation]);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
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
