/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from "yup";
import LinearGradient from "react-native-linear-gradient";
import { User, Mail, Lock, ShoppingBag, ArrowLeft } from "lucide-react-native";
import { theme } from "../styles/theme";
import { saveData, getData } from "../utils/storage";
import Button from "../components/common/Button";
import { useUserStore } from "../store/useUserStore";

// Stable icon constants — never recreated, keeps React.memo on Input working
const UserIcon = <User size={20} color={theme.colors.textSecondary} />;
const MailIcon = <Mail size={20} color={theme.colors.textSecondary} />;
const LockIcon = <Lock size={20} color={theme.colors.textSecondary} />;

const validationSchema = Yup.object({
  name: Yup.string().required("Name required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(6, "Min 6 chars").required("Password required"),
});


export default function SignupScreen({ navigation }: any) {
  const setUser = useUserStore((state) => state.setUser);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.mainContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <LinearGradient
          colors={['#1A237E', '#283593']}
          style={styles.topSection}
        >
          <SafeAreaView edges={['top']} style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={24} color={theme.colors.white} />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <ShoppingBag size={40} color={theme.colors.accent} strokeWidth={2.5} />
            </View>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitleText}>Join our exclusive shopping community</Text>
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
              <View style={styles.form}>
              <Formik
                initialValues={{ name: "", email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const registeredUsers = await getData("registered_users") || [];
                    const userExists = registeredUsers.find((u: any) => u.email.toLowerCase() === values.email.toLowerCase());

                    if (userExists) {
                      Alert.alert("Error", "User already exists with this email");
                      return;
                    }

                    const newUser = { ...values, id: Date.now() };
                    await saveData("registered_users", [...registeredUsers, newUser]);

                    setUser(newUser);
                    Alert.alert("Success", "Account Created!", [
                      { text: "Continue", onPress: () => navigation.replace("Tabs") }
                    ]);
                  } catch {
                    Alert.alert("Error", "Failed to create account");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ handleSubmit, values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
                  <>
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Full Name</Text>
                      <View style={[
                        styles.inputWrapper,
                        touched.name && errors.name ? styles.inputWrapperError : null,
                      ]}>
                        <View style={styles.leftIcon}>
                          {UserIcon}
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
                          placeholder="john@example.com"
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

                    <Button
                      title="Create Account"
                      onPress={handleSubmit as any}
                      loading={isSubmitting}
                      style={styles.button}
                      size="large"
                    />

                    <View style={styles.footer}>
                      <Text style={styles.footerText}>Already have an account? </Text>
                      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.loginLink}>Sign In</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </View>
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
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  welcomeText: {
    ...theme.typography.h2,
    color: theme.colors.white,
    textAlign: 'center',
    fontSize: 28,
  },
  subtitleText: {
    ...theme.typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: theme.spacing.xs,
    fontSize: 14,
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
  button: {
    borderRadius: 15,
    height: 56,
    marginTop: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  footerText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    ...theme.typography.bodyBold,
    color: theme.colors.primary,
    fontSize: 14,
  },
});
