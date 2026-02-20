/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { ArrowLeft, Package, MapPin, CreditCard, User, Calendar, Star,} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import { useOrderStore } from '../store/useOrderStore';
import { useReviewStore } from '../store/useReviewStore';
import { useUserStore } from '../store/useUserStore';
import Button from '../components/common/Button';

export default function OrderDetailScreen({ route, navigation }: any) {
    const orders = useOrderStore((state) => state.orders);
    const user = useUserStore((state) => state.user);
    const { reviews, addReview } = useReviewStore();

    // Get order from params or find by ID (for deep links)
    const order = route.params?.order || orders.find(o => o.id.toString() === route.params?.id);

    const isItemReviewed = (productId: number) => {
        return reviews.some(r => r.productId === productId && r.orderId === order?.id);
    };

    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            // Fallback to Orders list if opened from deep link
            navigation.navigate('Tabs', { screen: 'Orders' });
        }
    };

    if (!order) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <Text style={styles.errorText}>Order not found</Text>
                    <Button title="Go Back" onPress={handleBack} />
                </View>
            </SafeAreaView>
        );
    }

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Order Details</Text>
            <View style={{ width: 40 }} />
        </View>
    );

    const renderOrderItem = (item: any) => {
        const reviewed = isItemReviewed(item.id);

        return (
            <View key={item.id} style={styles.productRowContainer}>
                <View style={styles.productRow}>
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                    <View style={styles.productInfo}>
                        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                            <Text style={styles.productQty}>x{item.quantity}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.reviewButton, reviewed && styles.reviewedButton]}
                    disabled={reviewed}
                    onPress={() => {
                        setSelectedProduct(item);
                        setIsReviewModalVisible(true);
                    }}
                >
                    <Star
                        size={14}
                        color={reviewed ? theme.colors.success : theme.colors.primary}
                        fill={reviewed ? theme.colors.success : theme.colors.primary}
                    />
                    <Text style={[styles.reviewButtonText, reviewed && styles.reviewedButtonText]}>
                        {reviewed ? 'Reviewed' : 'Rate & Review'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const handleAddReview = () => {
        if (!user) {
            Alert.alert("Login Required", "Please login to leave a review.");
            return;
        }

        if (!newComment.trim()) {
            Alert.alert("Error", "Please enter a comment.");
            return;
        }

        addReview({
            productId: selectedProduct.id,
            orderId: order.id,
            userName: user.name || "Anonymous",
            rating: newRating,
            comment: newComment,
        });

        setNewComment("");
        setNewRating(5);
        setIsReviewModalVisible(false);
        Alert.alert("Success", "Review added successfully!");
    };

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

            <Modal
                visible={isReviewModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsReviewModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Rate this Product</Text>
                        <Text style={styles.selectedProductTitle} numberOfLines={1}>{selectedProduct?.title}</Text>

                        <View style={styles.ratingPicker}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <TouchableOpacity key={s} onPress={() => setNewRating(s)}>
                                    <Star
                                        size={32}
                                        color={s <= newRating ? "#FFB000" : theme.colors.border}
                                        fill={s <= newRating ? "#FFB000" : "transparent"}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={styles.commentInput}
                            placeholder="Share your experience..."
                            placeholderTextColor={theme.colors.textSecondary}
                            multiline
                            value={newComment}
                            onChangeText={setNewComment}
                        />

                        <View style={styles.modalButtons}>
                            <Button
                                title="Cancel"
                                variant="outline"
                                onPress={() => setIsReviewModalVisible(false)}
                                style={{ flex: 1 }}
                            />
                            <Button
                                title="Submit"
                                onPress={handleAddReview}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        ...theme.typography.body,
        marginBottom: 20,
    },
    productRowContainer: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingVertical: theme.spacing.sm,
    },
    productRow: {
        flexDirection: 'row',
    },
    reviewButton: {
        backgroundColor: theme.colors.background,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: theme.roundness.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        gap: 6,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    reviewButtonText: {
        ...theme.typography.caption,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    reviewedButton: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.success,
    },
    reviewedButtonText: {
        color: theme.colors.success,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        padding: 24,
    },
    modalTitle: {
        ...theme.typography.h2,
        textAlign: 'center',
        marginBottom: 4,
    },
    selectedProductTitle: {
        ...theme.typography.caption,
        textAlign: 'center',
        color: theme.colors.textSecondary,
        marginBottom: 20,
    },
    ratingPicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 20,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.roundness.md,
        padding: 12,
        height: 100,
        textAlignVertical: 'top',
        ...theme.typography.body,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
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
