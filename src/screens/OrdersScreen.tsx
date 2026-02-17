import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView
} from 'react-native';
import { ArrowLeft, Package, ChevronRight, Clock } from 'lucide-react-native';
import { getData } from '../utils/storage';
import { theme } from '../styles/theme';

export default function OrdersScreen({ navigation }: any) {
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        const storedOrders = await getData('orders');
        if (storedOrders) {
            // Sort by date descending
            setOrders(storedOrders.reverse());
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <View style={styles.orderIdGroup}>
                    <Package size={20} color={theme.colors.primary} />
                    <Text style={styles.orderId}>Order #{item.id.toString().slice(-6)}</Text>
                </View>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Delivered</Text>
                </View>
            </View>

            <View style={styles.orderInfo}>
                <View style={styles.infoRow}>
                    <Clock size={14} color={theme.colors.textSecondary} />
                    <Text style={styles.infoText}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.itemCount}>{item.items.length} {item.items.length === 1 ? 'item' : 'items'}</Text>
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>${item.total.toFixed(2)}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order History</Text>
                <View style={{ width: 40 }} />
            </View>

            {orders.length > 0 ? (
                <FlatList
                    data={orders}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Package size={80} color={theme.colors.border} />
                    <Text style={styles.emptyTitle}>No Orders Yet</Text>
                    <Text style={styles.emptySubtitle}>When you buy something, it will appear here!</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: {
        padding: theme.spacing.xs,
    },
    headerTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
    },
    list: {
        padding: theme.spacing.md,
    },
    orderCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    orderIdGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderId: {
        ...theme.typography.body,
        fontWeight: 'bold',
        marginLeft: theme.spacing.sm,
        color: theme.colors.text,
    },
    statusBadge: {
        backgroundColor: '#E8F5E9',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    statusText: {
        color: '#2E7D32',
        fontSize: 12,
        fontWeight: 'bold',
    },
    orderInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        ...theme.typography.caption,
        marginLeft: 6,
        color: theme.colors.textSecondary,
    },
    itemCount: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: theme.spacing.md,
    },
    totalLabel: {
        ...theme.typography.caption,
        fontWeight: '600',
    },
    totalValue: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        fontSize: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    emptyTitle: {
        ...theme.typography.h2,
        marginTop: theme.spacing.lg,
        color: theme.colors.text,
    },
    emptySubtitle: {
        ...theme.typography.caption,
        marginTop: theme.spacing.xs,
        textAlign: 'center',
    },
});
