import React from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from "yup";
import CustomHeader from "../components/CustomHeader";
import { theme } from "../styles/theme";
import { saveData, getData } from "../utils/storage";

const validationSchema = Yup.object({
  name: Yup.string().required("Name required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(6, "Min 6 chars").required("Password required"),
});

export default function SignupScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader title="Create Account" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Signup</Text>
            <Text style={styles.subtitle}>Join our marketplace today</Text>
          </View>

          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                const registeredUsers = await getData("registered_users") || [];
                const userExists = registeredUsers.find((u: any) => u.email.toLowerCase() === values.email.toLowerCase());

                if (userExists) {
                  Alert.alert("Error", "User already exists with this email");
                  return;
                }

                const newUser = { ...values, id: Date.now() };
                await saveData("registered_users", [...registeredUsers, newUser]);

                Alert.alert("Success", "Account Created!", [
                  { text: "Login Now", onPress: () => navigation.navigate("Login") }
                ]);
              } catch {
                Alert.alert("Error", "Failed to create account");
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    placeholder="Enter your name"
                    placeholderTextColor={theme.colors.textSecondary}
                    style={[
                      styles.input,
                      touched.name && errors.name && styles.inputError
                    ]}
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor={theme.colors.textSecondary}
                    style={[
                      styles.input,
                      touched.email && errors.email && styles.inputError
                    ]}
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
                    placeholder="Create a password"
                    placeholderTextColor={theme.colors.textSecondary}
                    secureTextEntry
                    style={[
                      styles.input,
                      touched.password && errors.password && styles.inputError
                    ]}
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
                  <Text style={styles.buttonText}>Signup</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.loginLink}>Login</Text>
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
  loginLink: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
