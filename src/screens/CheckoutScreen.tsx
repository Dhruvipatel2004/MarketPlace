import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from 'yup';
import CustomHeader from "../components/CustomHeader";
import { useCart } from "../context/CartContext";
import { saveData, getData } from "../utils/storage";
import { theme } from "../styles/theme";

const validationSchema = Yup.object({
    name: Yup.string().required('Name is Required'),
    phone: Yup.string().required('Phone Number is Required').matches(/^\d{10}$/, 'Phone Number must be 10 digits'),
    address: Yup.string().required('Address is Required')
})

export default function CheckoutScreen() {
    const navigation = useNavigation<any>();
    const { cart, totalPrice, clearCart } = useCart();

    const handlePlaceOrder = async (_values: any) => {
        try {
            const newOrder = {
                id: Date.now(),
                items: cart,
                total: totalPrice,
                date: new Date().toISOString(),
            };

            const existingOrders = await getData('orders') || [];
            await saveData('orders', [...existingOrders, newOrder]);

            Alert.alert(
                "Success",
                "Your order has been placed successfully!",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            clearCart();
                            navigation.navigate("Tabs");
                        }
                    }
                ]
            );
        } catch {
            Alert.alert("Error", "Failed to place order. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <CustomHeader title="Checkout" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Order Summary</Text>
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
                                handleChange, handleBlur, handleSubmit, values, errors, touched,
                            }: any) => (
                                <View style={styles.form}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Full Name</Text>
                                        <TextInput
                                            placeholder="John Doe"
                                            placeholderTextColor={theme.colors.textSecondary}
                                            style={[styles.input, touched.name && errors.name && styles.inputError]}
                                            value={values.name}
                                            onChangeText={handleChange('name')}
                                            onBlur={handleBlur("name")}
                                        />
                                        {touched.name && errors.name && (
                                            <Text style={styles.error}>{errors.name}</Text>
                                        )}
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Phone Number</Text>
                                        <TextInput
                                            placeholder="10 digit mobile number"
                                            placeholderTextColor={theme.colors.textSecondary}
                                            style={[styles.input, touched.phone && errors.phone && styles.inputError]}
                                            value={values.phone}
                                            keyboardType="phone-pad"
                                            onChangeText={handleChange("phone")}
                                            onBlur={handleBlur("phone")}
                                            maxLength={10}
                                        />
                                        {touched.phone && errors.phone && (
                                            <Text style={styles.error}>{errors.phone}</Text>
                                        )}
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Delivery Address</Text>
                                        <TextInput
                                            placeholder="Flat/House No, Street, Area"
                                            placeholderTextColor={theme.colors.textSecondary}
                                            style={[styles.input, styles.textArea, touched.address && errors.address && styles.inputError]}
                                            multiline
                                            numberOfLines={4}
                                            value={values.address}
                                            onChangeText={handleChange("address")}
                                            onBlur={handleBlur("address")}
                                        />
                                        {touched.address && errors.address && (
                                            <Text style={styles.error}>{errors.address}</Text>
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={handleSubmit}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.buttonText}>Confirm Order</Text>
                                    </TouchableOpacity>
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
    inputGroup: {
        marginBottom: theme.spacing.md,
    },
    label: {
        ...theme.typography.caption,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
        color: theme.colors.text,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        borderRadius: theme.roundness.md,
        fontSize: 16,
        color: theme.colors.text,
        backgroundColor: theme.colors.background,
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
        borderRadius: theme.roundness.md,
        marginTop: theme.spacing.sm,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: theme.colors.white,
        textAlign: "center",
        ...theme.typography.button,
    },
    error: {
        color: theme.colors.error,
        fontSize: 12,
        marginTop: 4,
    },
});
