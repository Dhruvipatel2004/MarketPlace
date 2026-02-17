import React, { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MainLayout from "../components/MainLayout";
import { theme } from "../styles/theme";

import { useWishlist } from "../context/WishlistContext";
import { Heart } from "lucide-react-native";

export default function HomeScreen({ navigation }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [numCols] = useState(2);
  const { toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("Details", { product: item })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <TouchableOpacity
          style={styles.wishlistBadge}
          onPress={() => toggleWishlist(item)}
        >
          <Heart
            size={18}
            color={isWishlisted(item.id) ? theme.colors.error : theme.colors.textSecondary}
            fill={isWishlisted(item.id) ? theme.colors.error : "transparent"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text numberOfLines={2} style={styles.title}>
          {item.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {item.rating?.rate || '4.5'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <MainLayout navigation={navigation}>
      <FlatList
        data={products}
        key={numCols}
        numColumns={numCols}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
      />
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness.lg,
    marginBottom: theme.spacing.md,
    width: '48%',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    backgroundColor: '#fff',
    padding: theme.spacing.md,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  wishlistBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  infoContainer: {
    padding: theme.spacing.sm,
  },
  title: {
    ...theme.typography.caption,
    fontWeight: '600',
    color: theme.colors.text,
    height: 36,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  ratingBadge: {
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.roundness.sm,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFB800',
  }
});
