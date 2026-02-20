import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { theme } from '../styles/theme';

interface SearchHeaderProps {
    onSearch: (text: string) => void;
    categories: string[];
    activeCategory: string;
    onSelectCategory: (category: string) => void;
    onOpenSort: () => void;
    activeSort: string;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
    onSearch,
    categories,
    activeCategory,
    onSelectCategory,
    onOpenSort,
}) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (text: string) => {
        setSearchValue(text);
        onSearch(text);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchRow}>
                <View style={styles.searchContainer}>
                    <Search size={18} color={theme.colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        placeholderTextColor="#9CA3AF"
                        value={searchValue}
                        onChangeText={handleSearch}
                    />
                </View>
                <TouchableOpacity style={styles.filterButton} onPress={onOpenSort}>
                    <SlidersHorizontal size={18} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
            >
                <TouchableOpacity
                    style={[
                        styles.categoryBadge,
                        activeCategory === 'All' && styles.categoryBadgeActive,
                    ]}
                    onPress={() => onSelectCategory('All')}
                >
                    <Text
                        style={[
                            styles.categoryText,
                            activeCategory === 'All' && styles.categoryTextActive,
                        ]}
                    >
                        All
                    </Text>
                    {activeCategory === 'All' && <View style={styles.activeDot} />}
                </TouchableOpacity>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryBadge,
                            activeCategory === category && styles.categoryBadgeActive,
                        ]}
                        onPress={() => onSelectCategory(category)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                activeCategory === category && styles.categoryTextActive,
                            ]}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Text>
                        {activeCategory === category && <View style={styles.activeDot} />}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.md,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
        gap: 12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        paddingHorizontal: theme.spacing.md,
        height: 48,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    searchIcon: {
        marginRight: theme.spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.text,
        paddingVertical: 0,
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    categoriesContainer: {
        paddingHorizontal: theme.spacing.md,
        gap: 12,
    },
    categoryBadge: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    categoryBadgeActive: {
        backgroundColor: theme.colors.primary + '10', // 10% opacity
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    categoryTextActive: {
        color: theme.colors.primary,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.primary,
        position: 'absolute',
        bottom: 6,
    },
});

export default SearchHeader;
