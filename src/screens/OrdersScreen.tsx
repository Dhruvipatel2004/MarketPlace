/* eslint-disable react-native/no-inline-styles */
import React, { useCallback } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ArrowLeft, Package, Clock } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { useOrderStore } from '../store/useOrderStore';

const OrderItem = React.memo(({ item }: { item: any }) => (
    <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
            <View style={styles.orderIdGroup}>
                <Package size={20} color={theme.colors.primary} />
                <Text style={styles.orderId}>Order #{item.id.toString().slice(-6)}</Text>
            </View>
            <Badge label="Delivered" variant="success" />
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
));

export default function OrdersScreen({ navigation }: any) {
    const orders = useOrderStore((state) => state.orders);

    const renderItem = useCallback(({ item }: { item: any }) => (
        <OrderItem item={item} />
    ), []);

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
                    removeClippedSubviews={true}
                    initialNumToRender={10}
                />
            ) : (
                <EmptyState
                    icon={<Package size={80} color={theme.colors.border} />}
                    title="No Orders Yet"
                    subtitle="When you buy something, it will appear here!"
                    buttonTitle="Shop Now"
                    onButtonPress={() => navigation.navigate("Tabs", { screen: "Home" })}
                />
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
});
