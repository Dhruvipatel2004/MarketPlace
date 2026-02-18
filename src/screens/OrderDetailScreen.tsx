import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import { ArrowLeft, Package, MapPin, CreditCard, User, Calendar } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';

export default function OrderDetailScreen({ route, navigation }: any) {
    const { order } = route.params;

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Order Details</Text>
            <View style={{ width: 40 }} />
        </View>
    );

    const renderOrderItem = (item: any) => (
        <View key={item.id} style={styles.productRow}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                    <Text style={styles.productQty}>x{item.quantity}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {renderHeader()}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Order Meta Info */}
                <View style={[styles.card, styles.metaCard]}>
                    <View style={styles.metaRow}>
                        <Package size={20} color={theme.colors.primary} />
                        <Text style={styles.orderId}>Order ID: #{order.id.toString().slice(-8)}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Calendar size={18} color={theme.colors.textSecondary} />
                        <Text style={styles.metaText}>{new Date(order.date).toLocaleString()}</Text>
                    </View>
                </View>

                {/* Products Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items Ordered</Text>
                    <View style={styles.card}>
                        {order.items.map(renderOrderItem)}
                    </View>
                </View>

                {/* Delivery Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Details</Text>
                    <View style={styles.card}>
                        <View style={styles.infoBlock}>
                            <User size={18} color={theme.colors.primary} style={styles.infoIcon} />
                            <View>
                                <Text style={styles.infoLabel}>Delivered To</Text>
                                <Text style={styles.infoValue}>{order.shippingDetails?.name || 'Customer'}</Text>
                                <Text style={styles.infoValue}>{order.shippingDetails?.phone}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoBlock}>
                            <MapPin size={18} color={theme.colors.primary} style={styles.infoIcon} />
                            <View>
                                <Text style={styles.infoLabel}>Delivery Address</Text>
                                <Text style={styles.infoValue}>{order.shippingDetails?.address}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Payment Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Summary</Text>
                    <View style={styles.card}>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Subtotal</Text>
                            <Text style={styles.paymentValue}>${order.total.toFixed(2)}</Text>
                        </View>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Shipping</Text>
                            <Text style={[styles.paymentValue, { color: theme.colors.success }]}>Free</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.paymentRow}>
                            <Text style={styles.grandTotalLabel}>Total Paid</Text>
                            <Text style={styles.grandTotalValue}>${order.total.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.metaRow, { marginTop: theme.spacing.md }]}>
                            <CreditCard size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.paymentMethod}>Paid via Integrated Payment Method</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footerSpace} />
            </ScrollView>
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
    scrollContent: {
        padding: theme.spacing.md,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.md,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    metaCard: {
        marginBottom: theme.spacing.lg,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 8,
    },
    orderId: {
        ...theme.typography.body,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    metaText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        ...theme.typography.body,
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
        color: theme.colors.text,
        marginLeft: 4,
    },
    productRow: {
        flexDirection: 'row',
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: theme.roundness.sm,
        backgroundColor: theme.colors.background,
        resizeMode: 'contain',
    },
    productInfo: {
        flex: 1,
        marginLeft: theme.spacing.md,
        justifyContent: 'center',
    },
    productTitle: {
        ...theme.typography.caption,
        fontWeight: '500',
        color: theme.colors.text,
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        ...theme.typography.caption,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    productQty: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    infoBlock: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    infoIcon: {
        marginTop: 4,
        marginRight: theme.spacing.md,
    },
    infoLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontWeight: '600',
        marginBottom: 2,
    },
    infoValue: {
        ...theme.typography.body,
        fontSize: 14,
        color: theme.colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: theme.spacing.md,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xs,
    },
    paymentLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    paymentValue: {
        ...theme.typography.caption,
        fontWeight: '600',
        color: theme.colors.text,
    },
    grandTotalLabel: {
        ...theme.typography.body,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    grandTotalValue: {
        ...theme.typography.h2,
        color: theme.colors.primary,
    },
    paymentMethod: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    footerSpace: {
        height: 40,
    },
});
