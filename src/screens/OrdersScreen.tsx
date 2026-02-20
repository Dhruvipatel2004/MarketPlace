/* eslint-disable react-native/no-inline-styles */
import React, { useCallback } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
} from 'react-native';
import { ArrowLeft, Package, Clock, ChevronRight, MapPin } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../components/common/EmptyState';
import { useOrderStore } from '../store/useOrderStore';

const OrderItem = React.memo(({ item, onPress }: { item: any; onPress: () => void }) => (
    <TouchableOpacity style={styles.orderCard} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.orderHeader}>
            <View style={styles.orderIdGroup}>
                <View style={styles.packageIcon}>
                    <Package size={18} color={theme.colors.primary} />
                </View>
                <View>
                    <Text style={styles.orderId}>Order #{item.id.toString().slice(-6)}</Text>
                    <View style={styles.dateRow}>
                        <Clock size={12} color={theme.colors.textSecondary} />
                        <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Processing</Text>
            </View>
        </View>

        <View style={styles.orderBody}>
            <View style={styles.itemsPreview}>
                <Text style={styles.itemCount}>{item.items.length} {item.items.length === 1 ? 'item' : 'items'}</Text>
                <View style={styles.addressRow}>
                    <MapPin size={12} color={theme.colors.textSecondary} />
                    <Text numberOfLines={1} style={styles.addressText}>{item.shippingDetails.address}</Text>
                </View>
            </View>
            <View style={styles.priceSection}>
                <Text style={styles.totalLabel}>Amount Paid</Text>
                <Text style={styles.totalValue}>${item.total.toFixed(2)}</Text>
            </View>
        </View>

        <View style={styles.orderFooter}>
            <Text style={styles.detailsLink}>View Order Details</Text>
            <ChevronRight size={16} color={theme.colors.primary} />
        </View>
    </TouchableOpacity>
));

export default function OrdersScreen({ navigation }: any) {
    const orders = useOrderStore((state) => state.orders);

    const renderItem = useCallback(({ item }: { item: any }) => (
        <OrderItem
            item={item}
            onPress={() => navigation.navigate("OrderDetail", { order: item })}
        />
    ), [navigation]);

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={22} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Order History</Text>
                    <View style={{ width: 44 }} />
                </View>

                {orders.length > 0 ? (
                    <FlatList
                        data={orders}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={true}
                    />
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <EmptyState
                            icon={<Package size={80} color={theme.colors.border} />}
                            title="No Orders Yet"
                            subtitle="When you buy something, it will appear here!"
                            buttonTitle="Start Shopping"
                            onButtonPress={() => navigation.navigate("Home")}
                        />
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.white,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h2,
        fontSize: 20,
    },
    list: {
        padding: theme.spacing.lg,
    },
    orderCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    orderIdGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    packageIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: theme.colors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderId: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    dateText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7', // Light orange for processing
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#F59E0B',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#92400E',
        textTransform: 'uppercase',
    },
    orderBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    itemsPreview: {
        flex: 1,
    },
    itemCount: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
        maxWidth: '90%',
    },
    addressText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    priceSection: {
        alignItems: 'flex-end',
    },
    totalLabel: {
        fontSize: 10,
        color: theme.colors.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '900',
        color: theme.colors.primary,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 12,
        gap: 4,
    },
    detailsLink: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.colors.primary,
    },
});
