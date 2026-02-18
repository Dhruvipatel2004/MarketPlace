import React from "react";
import {
  Text,
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
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useUserStore } from "../store/useUserStore";

const validationSchema = Yup.object({
  name: Yup.string().required("Name required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(6, "Min 6 chars").required("Password required"),
});

export default function SignupScreen({ navigation }: any) {
  const setUser = useUserStore((state) => state.setUser);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader title="Create Account" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Signup</Text>
            <Text style={styles.subtitle}>Join our marketplace today</Text>
          </View>

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
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View style={styles.form}>
                <Input
                  label="Full Name"
                  placeholder="Enter your name"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  error={touched.name && errors.name ? errors.name : undefined}
                />

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
                  placeholder="Create a password"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  error={touched.password && errors.password ? errors.password : undefined}
                  secureTextEntry
                />

                <Button
                  title="Signup"
                  onPress={handleSubmit as any}
                  loading={isSubmitting}
                  style={styles.button}
                  size="large"
                />

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
  loginLink: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
