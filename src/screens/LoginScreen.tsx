/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { Formik } from "formik";
import { Alert, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Keyboard, TouchableWithoutFeedback, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from 'yup';
import LinearGradient from "react-native-linear-gradient";
import { ShoppingBag, Mail, Lock } from "lucide-react-native";
import { theme } from "../styles/theme";
import Button from "../components/common/Button";
import { useUserStore } from "../store/useUserStore";
import { getData } from "../utils/storage";

// Stable icon references — defined outside the component so they are never
// recreated on re-render, which would break React.memo on <Input> and cause
// keyboard-dismiss flicker on every keystroke.
const MailIcon = <Mail size={20} color={theme.colors.textSecondary} />;
const LockIcon = <Lock size={20} color={theme.colors.textSecondary} />;

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string().min(6, "Min 6 chars").required("Password required"),
});

export default function LoginScreen({ navigation }: any) {
    const setUser = useUserStore((state) => state.setUser);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.mainContainer}>
                <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
                <LinearGradient
                    colors={[theme.colors.primary, '#283593']}
                    style={styles.topSection}
                >
                    <SafeAreaView edges={['top']} style={styles.headerContent}>
                        <View style={styles.logoContainer}>
                            <ShoppingBag size={48} color={theme.colors.accent} strokeWidth={2.5} />
                        </View>
                        <Text style={styles.welcomeText}>Welcome Back</Text>
                        <Text style={styles.subtitleText}>Sign in to your premium account</Text>
                    </SafeAreaView>
                </LinearGradient>

                <View style={styles.formContainer}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        style={styles.flex}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                            keyboardShouldPersistTaps="handled"
                        >
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
                                handleSubmit, values, errors, touched, isSubmitting, setFieldValue, setFieldTouched
                            }) => (
                                <View style={styles.form}>
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>Email Address</Text>
                                        <View style={[
                                            styles.inputWrapper,
                                            touched.email && errors.email ? styles.inputWrapperError : null,
                                        ]}>
                                            <View style={styles.leftIcon}>
                                                {MailIcon}
                                            </View>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="name@example.com"
                                                placeholderTextColor="#9CA3AF"
                                                value={values.email}
                                                onChangeText={(text) => setFieldValue('email', text)}
                                                onBlur={() => setFieldTouched('email')}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />
                                        </View>
                                        {touched.email && errors.email ? (
                                            <Text style={styles.errorText}>{errors.email}</Text>
                                        ) : null}
                                    </View>

                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>Password</Text>
                                        <View style={[
                                            styles.inputWrapper,
                                            touched.password && errors.password ? styles.inputWrapperError : null,
                                        ]}>
                                            <View style={styles.leftIcon}>
                                                {LockIcon}
                                            </View>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="••••••••"
                                                placeholderTextColor="#9CA3AF"
                                                value={values.password}
                                                onChangeText={(text) => setFieldValue('password', text)}
                                                onBlur={() => setFieldTouched('password')}
                                                secureTextEntry
                                            />
                                        </View>
                                        {touched.password && errors.password ? (
                                            <Text style={styles.errorText}>{errors.password}</Text>
                                        ) : null}
                                    </View>

                                    <TouchableOpacity style={styles.forgotPassword}>
                                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                    </TouchableOpacity>

                                    <Button
                                        title="Sign In"
                                        onPress={handleSubmit as any}
                                        loading={isSubmitting}
                                        style={styles.button}
                                        size="large"
                                    />

                                    <View style={styles.divider}>
                                        <View style={styles.line} />
                                        <Text style={styles.dividerText}>OR</Text>
                                        <View style={styles.line} />
                                    </View>

                                    <View style={styles.footer}>
                                        <Text style={styles.footerText}>Don't have an account? </Text>
                                        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                                            <Text style={styles.signupLink}>Create Account</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    topSection: {
        height: '35%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    welcomeText: {
        ...theme.typography.h1,
        color: theme.colors.white,
        textAlign: 'center',
    },
    subtitleText: {
        ...theme.typography.caption,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: theme.spacing.xs,
        fontSize: 16,
    },
    formContainer: {
        flex: 1,
        marginTop: -30,
        paddingHorizontal: theme.spacing.lg,
    },
    scrollContent: {
        flexGrow: 1,
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
    },
    form: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: 30,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    fieldContainer: {
        marginBottom: theme.spacing.lg,
    },
    label: {
        ...theme.typography.caption,
        marginBottom: theme.spacing.sm,
        color: theme.colors.text,
        fontWeight: '700',
        fontSize: 14,
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
    inputWrapperError: {
        borderColor: theme.colors.error,
        backgroundColor: '#FFF5F5',
    },
    leftIcon: {
        marginRight: theme.spacing.sm,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: theme.colors.text,
        fontWeight: '500',
    },
    errorText: {
        ...theme.typography.caption,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
        fontWeight: '500',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: theme.spacing.lg,
    },
    forgotPasswordText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    button: {
        borderRadius: 15,
        height: 56,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme.spacing.xl,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    dividerText: {
        ...theme.typography.caption,
        marginHorizontal: theme.spacing.md,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
    signupLink: {
        ...theme.typography.bodyBold,
        color: theme.colors.primary,
        fontSize: 14,
    },
});
