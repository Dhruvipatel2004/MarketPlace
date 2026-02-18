import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react-native';
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
    activeSort,
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
                    <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        placeholderTextColor={theme.colors.textSecondary}
                        value={searchValue}
                        onChangeText={handleSearch}
                    />
                </View>
                <TouchableOpacity style={styles.filterButton} onPress={onOpenSort}>
                    <SlidersHorizontal size={20} color={theme.colors.primary} />
                    <Text style={styles.sortText}>{activeSort}</Text>
                    <ChevronDown size={14} color={theme.colors.primary} />
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
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
        gap: theme.spacing.md,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: theme.roundness.md,
        paddingHorizontal: theme.spacing.sm,
        height: 44,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    searchIcon: {
        marginRight: theme.spacing.xs,
    },
    searchInput: {
        flex: 1,
        ...theme.typography.body,
        paddingVertical: 0,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.roundness.md,
        height: 44,
        gap: 6,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    sortText: {
        ...theme.typography.caption,
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    categoriesContainer: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.xs,
        gap: theme.spacing.sm,
    },
    categoryBadge: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    categoryBadgeActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    categoryText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    categoryTextActive: {
        color: theme.colors.white,
        fontWeight: 'bold',
    },
});

export default SearchHeader;
