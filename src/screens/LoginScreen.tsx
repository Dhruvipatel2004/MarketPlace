import React from "react";
import { Formik } from "formik";
import { Alert, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from 'yup';
import CustomHeader from "../components/CustomHeader";
import { getData } from "../utils/storage";
import { theme } from "../styles/theme";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useUserStore } from "../store/useUserStore";

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string().min(6, "Min 6 chars").required("Password required"),
});

export default function LoginScreen({ navigation }: any) {
    const setUser = useUserStore((state) => state.setUser);

    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomHeader title="Welcome Back" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Login</Text>
                        <Text style={styles.subtitle}>Sign in to continue shopping</Text>
                    </View>

                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                const registeredUsers = await getData("registered_users") || [];
                                const user = registeredUsers.find(
                                    (u: any) => u.email.toLowerCase() === values.email.toLowerCase() && u.password === values.password
                                );

                                if (!user) {
                                    Alert.alert("Auth Failed", "Invalid email or password. Please signup first.");
                                    return;
                                }

                                setUser(user);
                                navigation.replace("Tabs");
                            } catch {
                                Alert.alert("Error", "Something went wrong during login");
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({
                            handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting
                        }) => (
                            <View style={styles.form}>
                                <Input
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    error={touched.email && errors.email ? errors.email : undefined}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />

                                <Input
                                    label="Password"
                                    placeholder="Enter your password"
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    error={touched.password && errors.password ? errors.password : undefined}
                                    secureTextEntry
                                />

                                <Button
                                    title="Login"
                                    onPress={handleSubmit as any}
                                    loading={isSubmitting}
                                    style={styles.button}
                                    size="large"
                                />

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
    button: {
        marginTop: theme.spacing.md,
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
