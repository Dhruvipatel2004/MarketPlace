import React, { useMemo } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from 'yup';
import CustomHeader from "../components/CustomHeader";
import { theme } from "../styles/theme";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useCartStore } from "../store/useCartStore";
import { useOrderStore } from "../store/useOrderStore";
import GetLocation from 'react-native-get-location';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import axios from 'axios';

const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

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

    const handlePlaceOrder = async (values: any, { setSubmitting }: any) => {
        try {
            const newOrder = {
                id: Date.now(),
                items: cart,
                total: totalPrice,
                date: new Date().toISOString(),
                shippingDetails: values
            };

            addOrder(newOrder);
            ReactNativeHapticFeedback.trigger("notificationSuccess", hapticOptions);

            Alert.alert(
                "Success",
                "Your order has been placed successfully!",
                [
                    {
                        text: "OK",
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

    const orderSummary = useMemo(() => {
        return cart.map((item) => (
            <View key={item.id} style={styles.summaryItem}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title} <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                </Text>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
        ));
    }, [cart]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <CustomHeader title="Checkout" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Order Summary</Text>
                        <View style={styles.summaryCard}>
                            {orderSummary}
                            <View style={styles.divider} />
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Grand Total</Text>
                                <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Shipping Details</Text>
                        <Formik
                            initialValues={{ name: "", phone: "", address: "" }}
                            validationSchema={validationSchema}
                            onSubmit={handlePlaceOrder}
                        >
                            {({
                                handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue
                            }: any) => (
                                <View style={styles.form}>
                                    <Input
                                        label="Full Name"
                                        placeholder="John Doe"
                                        value={values.name}
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur("name")}
                                        error={touched.name && errors.name ? errors.name : undefined}
                                    />

                                    <Input
                                        label="Phone Number"
                                        placeholder="10 digit mobile number"
                                        value={values.phone}
                                        keyboardType="phone-pad"
                                        onChangeText={handleChange("phone")}
                                        onBlur={handleBlur("phone")}
                                        maxLength={10}
                                        error={touched.phone && errors.phone ? errors.phone : undefined}
                                    />

                                    <View style={styles.addressLabelRow}>
                                        <Text style={styles.label}>Delivery Address</Text>
                                        <TouchableOpacity
                                            onPress={async () => {
                                                try {
                                                    const location = await GetLocation.getCurrentPosition({
                                                        enableHighAccuracy: true,
                                                        timeout: 15000,
                                                    });

                                                    ReactNativeHapticFeedback.trigger("impactMedium", hapticOptions);

                                                    // Reverse Geocoding using Nominatim (OpenStreetMap)
                                                    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                                                        params: {
                                                            format: 'jsonv2',
                                                            lat: location.latitude,
                                                            lon: location.longitude,
                                                        },
                                                        headers: {
                                                            'User-Agent': 'MarketPlaceApp/1.0'
                                                        }
                                                    });

                                                    if (response.data && response.data.display_name) {
                                                        let fullAddress = response.data.display_name;

                                                        // Clean up: Remove ", India" from the end if present
                                                        fullAddress = fullAddress.replace(/, India$/, '');

                                                        setFieldValue('address', fullAddress);
                                                    } else {
                                                        setFieldValue('address', `Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`);
                                                    }
                                                } catch (error) {
                                                    console.error("Location error:", error);
                                                    Alert.alert("Error", "Could not fetch your location or address. Please check your permissions.");
                                                }
                                            }}
                                        >
                                            <Text style={styles.locationLink}>Auto-fill Location</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Input
                                        placeholder="Flat/House No, Street, Area"
                                        multiline
                                        numberOfLines={4}
                                        value={values.address}
                                        onChangeText={handleChange("address")}
                                        onBlur={handleBlur("address")}
                                        error={touched.address && errors.address ? errors.address : undefined}
                                        style={styles.textArea}
                                    />

                                    <Button
                                        title="Confirm Order"
                                        onPress={handleSubmit as any}
                                        loading={isSubmitting}
                                        style={styles.button}
                                        size="large"
                                    />
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    container: {
        padding: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.body,
        fontWeight: 'bold',
        marginBottom: theme.spacing.md,
        color: theme.colors.text,
    },
    summaryCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.md,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    itemTitle: {
        ...theme.typography.caption,
        color: theme.colors.text,
        flex: 1,
        marginRight: 10,
    },
    itemQuantity: {
        color: theme.colors.textSecondary,
        fontWeight: 'bold',
    },
    itemPrice: {
        ...theme.typography.caption,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: theme.spacing.sm,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        ...theme.typography.body,
        fontWeight: 'bold',
    },
    totalAmount: {
        ...theme.typography.h2,
        color: theme.colors.primary,
    },
    form: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.md,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.roundness.lg,
    },
    button: {
        marginTop: theme.spacing.sm,
    },
    addressLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    label: {
        ...theme.typography.body,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    locationLink: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
});
