import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableOpacity
} from "react-native";
import MainLayout from "../components/MainLayout";
import { theme } from "../styles/theme";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/common/ProductCard";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import SearchHeader from "../components/SearchHeader";
import EmptyState from "../components/common/EmptyState";
import { SearchX } from "lucide-react-native";
import { ProductCardSkeleton } from "../components/common/SkeletonLoader";

type SortOption = 'Default' | 'Price: Low' | 'Price: High' | 'Rating';

export default function HomeScreen({ navigation }: any) {
  const { products, loading, refresh } = useProducts();
  const addToCart = useCartStore((state) => state.addToCart);

  // Select wishlist to trigger re-renders when it changes
  const wishlist = useWishlistStore((state) => state.wishlist);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSort, setActiveSort] = useState<SortOption>("Default");
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p: any) => p.category));
    return Array.from(cats) as string[];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Search
    if (searchQuery) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by Category
    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }

    // Sort
    switch (activeSort) {
      case 'Price: Low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'Rating':
        result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      default:
        // Keep original order
        break;
    }

    return result;
  }, [products, searchQuery, activeCategory, activeSort]);

  const handleProductPress = useCallback((product: any) => {
    navigation.navigate("Details", { product });
  }, [navigation]);

  const renderProduct = useCallback(({ item }: { item: any }) => {
    const isItemWishlisted = wishlist.some(w => w.id === item.id);

    return (
      <ProductCard
        product={item}
        onPress={() => handleProductPress(item)}
        onWishlistToggle={() => toggleWishlist(item)}
        isWishlisted={isItemWishlisted}
        variant="grid"
        onAddToCart={() => addToCart(item)}
      />
    );
  }, [handleProductPress, toggleWishlist, wishlist, addToCart]);

  const handleSortSelect = (option: SortOption) => {
    setActiveSort(option);
    setIsSortModalVisible(false);
  };

  if (loading && products.length === 0) {
    return (
      <MainLayout navigation={navigation}>
        <SearchHeader
          onSearch={() => { }}
          categories={[]}
          activeCategory="All"
          onSelectCategory={() => { }}
          onOpenSort={() => { }}
          activeSort="Default"
        />
        <View style={styles.skeletonContainer}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout navigation={navigation}>
      <SearchHeader
        onSearch={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenSort={() => setIsSortModalVisible(true)}
        activeSort={activeSort}
      />

      <FlatList
        data={filteredAndSortedProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={refresh}
        refreshing={loading}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon={<SearchX size={80} color={theme.colors.border} />}
              title="No Products Found"
              subtitle="Try adjusting your search or category filter"
              buttonTitle="Clear Filters"
              onButtonPress={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setActiveSort("Default");
              }}
            />
          ) : null
        }
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={6}
      />

      <Modal
        visible={isSortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSortModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>
            {(['Default', 'Price: Low', 'Price: High', 'Rating'] as SortOption[]).map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.sortOption,
                  activeSort === option && styles.sortOptionActive
                ]}
                onPress={() => handleSortSelect(option)}
              >
                <Text style={[
                  styles.sortOptionText,
                  activeSort === option && styles.sortOptionTextActive
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingBottom: 40,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.roundness.xl,
    borderTopRightRadius: theme.roundness.xl,
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  modalTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  sortOption: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
  },
  sortOptionActive: {
    backgroundColor: '#F0F7FF',
    borderRadius: theme.roundness.md,
  },
  sortOptionText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  sortOptionTextActive: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
