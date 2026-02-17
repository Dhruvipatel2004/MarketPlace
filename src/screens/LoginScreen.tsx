import React from "react";
import { Formik } from "formik";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from 'yup';
import CustomHeader from "../components/CustomHeader";
import { saveData, getData } from "../utils/storage";
import { theme } from "../styles/theme";

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string().min(6, "Min 6 chars").required("Password required"),
});

export default function LoginScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomHeader title="Welcome Back" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Login</Text>
                        <Text style={styles.subtitle}>Sign in to continue shopping</Text>
                    </View>

                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={validationSchema}
                        onSubmit={async (values) => {
                            try {
                                const registeredUsers = await getData("registered_users") || [];
                                const user = registeredUsers.find(
                                    (u: any) => u.email.toLowerCase() === values.email.toLowerCase() && u.password === values.password
                                );

                                if (!user) {
                                    Alert.alert("Auth Failed", "Invalid email or password. Please signup first.");
                                    return;
                                }

                                await saveData("user", user);
                                Alert.alert("Success", "Login Successful", [
                                    { text: "OK", onPress: () => navigation.replace("Tabs") }
                                ]);
                            } catch {
                                Alert.alert("Error", "Something went wrong during login");
                            }
                        }}
                    >
                        {({
                            handleChange, handleBlur, handleSubmit, values, errors, touched,
                        }) => (
                            <View style={styles.form}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Email Address</Text>
                                    <TextInput
                                        placeholder="Enter your email"
                                        style={[
                                            styles.input,
                                            touched.email && errors.email && styles.inputError
                                        ]}
                                        placeholderTextColor={theme.colors.textSecondary}
                                        value={values.email}
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    {touched.email && errors.email && (
                                        <Text style={styles.errorText}>{errors.email}</Text>
                                    )}
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Password</Text>
                                    <TextInput
                                        placeholder="Enter your password"
                                        placeholderTextColor={theme.colors.textSecondary}
                                        style={[
                                            styles.input,
                                            touched.password && errors.password && styles.inputError
                                        ]}
                                        secureTextEntry
                                        value={values.password}
                                        onChangeText={handleChange("password")}
                                        onBlur={handleBlur("password")}
                                    />
                                    {touched.password && errors.password && (
                                        <Text style={styles.errorText}>{errors.password}</Text>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleSubmit as any}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buttonText}>Login</Text>
                                </TouchableOpacity>

                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>Don't have an account? </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                                        <Text style={styles.signupLink}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </Formik>
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
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: theme.spacing.lg,
        justifyContent: 'center',
    },
    header: {
        marginBottom: theme.spacing.xl,
    },
    title: {
        ...theme.typography.h1,
        color: theme.colors.text,
    },
    subtitle: {
        ...theme.typography.caption,
        marginTop: theme.spacing.xs,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: theme.spacing.md,
    },
    label: {
        ...theme.typography.caption,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
        color: theme.colors.text,
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        borderRadius: theme.roundness.md,
        fontSize: 16,
        color: theme.colors.text,
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 12,
        marginTop: 4,
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
        borderRadius: theme.roundness.md,
        marginTop: theme.spacing.md,
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.xl,
    },
    footerText: {
        ...theme.typography.caption,
    },
    signupLink: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
});
