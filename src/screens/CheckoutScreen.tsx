/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    StatusBar,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, MapPin, Phone, User, CreditCard, ShieldCheck } from 'lucide-react-native';
import * as Yup from 'yup';
import { theme } from "../styles/theme";
import Button from "../components/common/Button";
import { useCartStore } from "../store/useCartStore";
import { useOrderStore } from "../store/useOrderStore";
import GetLocation from 'react-native-get-location';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import axios from 'axios';
import { notificationService } from "../utils/NotificationService";

const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

// Stable icon constants — never recreated, keeps React.memo on Input working
const UserFieldIcon = <User size={18} color={theme.colors.textSecondary} />;
const PhoneFieldIcon = <Phone size={18} color={theme.colors.textSecondary} />;

const validationSchema = Yup.object({
    name: Yup.string().required('Name is Required'),
    phone: Yup.string().required('Phone Number is Required').matches(/^\d{10}$/, 'Phone Number must be 10 digits'),
    address: Yup.string().required('Address is Required')
})

export default function CheckoutScreen() {
    const navigation = useNavigation<any>();
    const cart = useCartStore((state) => state.cart);
    const totalPrice = useCartStore((state) => state.totalPrice);
    const clearCart = useCartStore((state) => state.clearCart);
    const addOrder = useOrderStore((state) => state.addOrder);

    const tax = totalPrice * 0.08;
    const finalTotal = totalPrice + tax;

    const handlePlaceOrder = async (values: any, { setSubmitting }: any) => {
        try {
            const newOrder = {
                id: Date.now(),
                items: cart,
                total: finalTotal,
                date: new Date().toISOString(),
                shippingDetails: values
            };

            notificationService.displayImmediateNotification(
                "Order Placed! 🎉",
                `Thanks ${values.name}, your order for $${finalTotal.toFixed(2)} is being processed.`,
                { screen: 'Orders' }
            );

            notificationService.scheduleNotification(
                "How was your experience?",
                "Tell us what you think of the MarketPlace app!",
                30,
                { screen: 'OrderDetail', id: newOrder.id.toString() }
            );

            addOrder(newOrder);
            ReactNativeHapticFeedback.trigger("notificationSuccess", hapticOptions);

            Alert.alert(
                "Order Confirmed!",
                "Your premium order has been successfully placed.",
                [
                    {
                        text: "Done",
                        onPress: () => {
                            clearCart();
                            navigation.replace("Tabs");
                        }
                    }
                ]
            );
        } catch {
            Alert.alert("Error", "Failed to place order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <ArrowLeft size={22} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Checkout</Text>
                    <View style={{ width: 44 }} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Summary</Text>
                            <View style={styles.summaryCard}>
                                {cart.map((item) => (
                                    <View key={item.id} style={styles.summaryItem}>
                                        <Text style={styles.itemTitle} numberOfLines={1}>
                                            {item.title} <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                                        </Text>
                                        <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                                    </View>
                                ))}
                                <View style={styles.divider} />
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Subtotal</Text>
                                    <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Tax (8%)</Text>
                                    <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
                                </View>
                                <View style={[styles.summaryRow, { marginTop: 8 }]}>
                                    <Text style={styles.totalLabel}>Total</Text>
                                    <Text style={styles.totalAmount}>${finalTotal.toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Delivery Details</Text>
                            <Formik
                                initialValues={{ name: "", phone: "", address: "" }}
                                validationSchema={validationSchema}
                                onSubmit={handlePlaceOrder}
                            >
                                {({
                                    handleSubmit, values, errors, touched, isSubmitting, setFieldValue, setFieldTouched
                                }: any) => (
                                    <View style={styles.formCard}>
                                        <View style={styles.fieldContainer}>
                                            <Text style={styles.fieldLabel}>Full Name</Text>
                                            <View style={[
                                                styles.inputWrapper,
                                                touched.name && errors.name ? styles.inputWrapperError : null,
                                            ]}>
                                                <View style={styles.leftIcon}>
                                                    {UserFieldIcon}
                                                </View>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="John Doe"
                                                    placeholderTextColor="#9CA3AF"
                                                    value={values.name}
                                                    onChangeText={(text) => setFieldValue('name', text)}
                                                    onBlur={() => setFieldTouched('name')}
                                                />
                                            </View>
                                            {touched.name && errors.name ? (
                                                <Text style={styles.errorText}>{errors.name}</Text>
                                            ) : null}
                                        </View>

                                        <View style={styles.fieldContainer}>
                                            <Text style={styles.fieldLabel}>Phone Number</Text>
                                            <View style={[
                                                styles.inputWrapper,
                                                touched.phone && errors.phone ? styles.inputWrapperError : null,
                                            ]}>
                                                <View style={styles.leftIcon}>
                                                    {PhoneFieldIcon}
                                                </View>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="10 digit mobile number"
                                                    placeholderTextColor="#9CA3AF"
                                                    value={values.phone}
                                                    keyboardType="phone-pad"
                                                    onChangeText={(text) => setFieldValue('phone', text)}
                                                    onBlur={() => setFieldTouched('phone')}
                                                    maxLength={10}
                                                />
                                            </View>
                                            {touched.phone && errors.phone ? (
                                                <Text style={styles.errorText}>{errors.phone}</Text>
                                            ) : null}
                                        </View>

                                        <View style={styles.addressLabelRow}>
                                            <Text style={styles.inputLabel}>Delivery Address</Text>
                                            <TouchableOpacity
                                                style={styles.locationTag}
                                                onPress={async () => {
                                                    try {
                                                        const location = await GetLocation.getCurrentPosition({
                                                            enableHighAccuracy: true,
                                                            timeout: 15000,
                                                        });
                                                        ReactNativeHapticFeedback.trigger("impactMedium", hapticOptions);
                                                        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                                                            params: { format: 'jsonv2', lat: location.latitude, lon: location.longitude },
                                                            headers: { 'User-Agent': 'MarketPlaceApp/1.0' }
                                                        });
                                                        if (response.data && response.data.display_name) {
                                                            setFieldValue('address', response.data.display_name.replace(/, India$/, ''));
                                                        }
                                                    } catch {
                                                        Alert.alert("Error", "Could not fetch location.");
                                                    }
                                                }}
                                            >
                                                <MapPin size={12} color={theme.colors.primary} />
                                                <Text style={styles.locationText}>Use Current</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.fieldContainer}>
                                            <View style={[
                                                styles.inputWrapper,
                                                styles.textAreaWrapper,
                                                touched.address && errors.address ? styles.inputWrapperError : null,
                                            ]}>
                                                <TextInput
                                                    style={[styles.input, styles.textAreaInput]}
                                                    placeholder="Flat/House No, Street, Area"
                                                    placeholderTextColor="#9CA3AF"
                                                    multiline
                                                    numberOfLines={4}
                                                    value={values.address}
                                                    onChangeText={(text) => setFieldValue('address', text)}
                                                    onBlur={() => setFieldTouched('address')}
                                                />
                                            </View>
                                            {touched.address && errors.address ? (
                                                <Text style={styles.errorText}>{errors.address}</Text>
                                            ) : null}
                                        </View>

                                        <View style={styles.paymentHighlight}>
                                            <CreditCard size={20} color={theme.colors.primary} />
                                            <View>
                                                <Text style={styles.paymentTitle}>Cash on Delivery</Text>
                                                <Text style={styles.paymentSubtitle}>Pay when you receive the product</Text>
                                            </View>
                                            <ShieldCheck size={20} color={theme.colors.success} style={{ marginLeft: 'auto' }} />
                                        </View>

                                        <Button
                                            title="Confirm & Place Order"
                                            onPress={handleSubmit as any}
                                            loading={isSubmitting}
                                            style={styles.confirmBtn}
                                            size="large"
                                        />
                                    </View>
                                )}
                            </Formik>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    safeArea: {
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
    backBtn: {
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
    keyboardView: {
        flex: 1,
    },
    container: {
        padding: theme.spacing.lg,
        paddingBottom: 60,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    summaryCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        flex: 1,
        marginRight: 10,
    },
    itemQuantity: {
        color: theme.colors.textSecondary,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    summaryLabel: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '800',
    },
    totalAmount: {
        fontSize: 22,
        fontWeight: '900',
        color: theme.colors.primary,
    },
    formCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    fieldContainer: {
        marginBottom: theme.spacing.lg,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: theme.spacing.md,
        height: 56,
    },
    textAreaWrapper: {
        height: 110,
        paddingTop: 12,
        alignItems: 'flex-start',
    },
    inputWrapperError: {
        borderColor: theme.colors.error,
        backgroundColor: '#FFF5F5',
    },
    leftIcon: {
        marginRight: theme.spacing.sm,
        marginTop: 2,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: theme.colors.text,
        fontWeight: '500',
    },
    textAreaInput: {
        textAlignVertical: 'top',
    },
    errorText: {
        ...theme.typography.caption,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
        fontWeight: '500',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 8,
    },
    addressLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: theme.colors.primary + '10',
        borderRadius: 8,
    },
    locationText: {
        fontSize: 10,
        fontWeight: '800',
        color: theme.colors.primary,
        textTransform: 'uppercase',
    },
    paymentHighlight: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 16,
        gap: 12,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    paymentTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.text,
    },
    paymentSubtitle: {
        fontSize: 11,
        color: theme.colors.textSecondary,
    },
    confirmBtn: {
        height: 56,
        borderRadius: 16,
    },
});
