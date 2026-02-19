import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface CustomHeaderProps {
  title: string;
  showBack?: boolean;
}

export default function CustomHeader({ title, showBack = true }: CustomHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Tabs' as never)}
            style={styles.backButton}
          >
            <ChevronLeft color="#000" size={28} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      <View style={styles.rightContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  leftContainer: { width: 40 },
  rightContainer: { width: 40 },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 5,
  },
});