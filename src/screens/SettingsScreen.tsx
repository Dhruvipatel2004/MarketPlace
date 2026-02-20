/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    TextInput,
    Alert,
    Modal,
    StatusBar,
    Platform,
} from 'react-native';
import {
    ArrowLeft,
    User,
    Lock,
    Bell,
    Moon,
    HelpCircle,
    Info,
    ChevronRight,
 
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import { useUserStore } from '../store/useUserStore';
import { getData, saveData } from '../utils/storage';

export default function SettingsScreen({ navigation }: any) {
    const user = useUserStore((state) => state.user);
    const updateName = useUserStore((state) => state.updateName);

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);

    // Name change state
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');

    // Password change state
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const handleSaveName = async () => {
        if (!newName.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        try {
            const registeredUsers = await getData("registered_users") || [];
            const updatedUsers = registeredUsers.map((u: any) =>
                u.email.toLowerCase() === user?.email.toLowerCase()
                    ? { ...u, name: newName.trim() }
                    : u
            );
            await saveData("registered_users", updatedUsers);

            updateName(newName.trim());
            setIsEditingName(false);
            Alert.alert('Success', 'Profile name updated');
        } catch {
            Alert.alert('Error', 'Failed to update name');
        }
    };

    const handleChangePassword = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        if (passwords.new.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters');
            return;
        }
        if (passwords.new !== passwords.confirm) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        try {
            const registeredUsers = await getData("registered_users") || [];
            const userIndex = registeredUsers.findIndex(
                (u: any) => u.email.toLowerCase() === user?.email.toLowerCase() && u.password === passwords.current
            );

            if (userIndex === -1) {
                Alert.alert('Error', 'Incorrect current password');
                return;
            }

            registeredUsers[userIndex].password = passwords.new;
            await saveData("registered_users", registeredUsers);

            Alert.alert('Success', 'Password changed successfully');
            setIsChangingPassword(false);
            setPasswords({ current: '', new: '', confirm: '' });
        } catch  {
            Alert.alert('Error', 'Failed to update password');
        }
    };

    const renderItem = (icon: any, label: string, color: string, value?: any, onPress?: () => void) => (
        <TouchableOpacity
            style={styles.item}
            onPress={onPress}
            disabled={typeof value === 'boolean'}
            activeOpacity={0.7}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, { backgroundColor: color + '10' }]}>
                    {React.cloneElement(icon as React.ReactElement<any>, { color, size: 20 })}
                </View>
                <Text style={styles.itemLabel}>{label}</Text>
            </View>
            <View style={styles.itemRight}>
                {typeof value === 'boolean' ? (
                    <Switch
                        value={value}
                        onValueChange={onPress as any}
                        trackColor={{ false: '#E5E7EB', true: theme.colors.primary }}
                        thumbColor={Platform.OS === 'ios' ? undefined : (value ? theme.colors.white : '#F3F4F6')}
                    />
                ) : (
                    <>
                        {value && <Text style={styles.itemValue}>{value}</Text>}
                        {onPress && <ChevronRight size={18} color="#D1D5DB" />}
                    </>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <ArrowLeft size={22} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.sectionHeader}>Personal Information</Text>
                    <View style={styles.sectionCard}>
                        {renderItem(<User />, "Account Name", theme.colors.primary, user?.name, () => {
                            setNewName(user?.name || '');
                            setIsEditingName(true);
                        })}
                        {renderItem(<Lock />, "Security Credentials", "#6366F1", "Password", () => setIsChangingPassword(true))}
                    </View>

                    <Text style={styles.sectionHeader}>Preferences</Text>
                    <View style={styles.sectionCard}>
                        {renderItem(<Bell />, "Push Notifications", "#F59E0B", pushEnabled, () => setPushEnabled(!pushEnabled))}
                        {renderItem(<Bell />, "Email Updates", "#10B981", emailEnabled, () => setEmailEnabled(!emailEnabled))}
                        {renderItem(<Moon />, "Dark Interface", "#6B7280", isDarkMode, () => setIsDarkMode(!isDarkMode))}
                    </View>

                    <Text style={styles.sectionHeader}>General</Text>
                    <View style={styles.sectionCard}>
                        {renderItem(<HelpCircle />, "Help & Feedback", theme.colors.primary, null, () => Alert.alert('Help', 'Linking to support...'))}
                        {renderItem(<Info />, "Application Info", "#9CA3AF", "v1.0.0")}
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Modals with Premium Styling */}
            <Modal visible={isEditingName || isChangingPassword} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIndicator} />
                        <Text style={styles.modalTitle}>{isEditingName ? 'Edit Account Name' : 'Update Security'}</Text>

                        {isEditingName ? (
                            <View style={styles.modalInputContainer}>
                                <Text style={styles.inputLabel}>Display Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newName}
                                    onChangeText={setNewName}
                                    placeholder="Full Name"
                                    placeholderTextColor="#9CA3AF"
                                    autoFocus
                                />
                            </View>
                        ) : (
                            <View style={styles.modalInputContainer}>
                                <Text style={styles.inputLabel}>Security Details</Text>
                                <TextInput
                                    style={styles.input}
                                    value={passwords.current}
                                    onChangeText={(text) => setPasswords({ ...passwords, current: text })}
                                    placeholder="Current Password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry
                                />
                                <TextInput
                                    style={styles.input}
                                    value={passwords.new}
                                    onChangeText={(text) => setPasswords({ ...passwords, new: text })}
                                    placeholder="New Password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry
                                />
                                <TextInput
                                    style={styles.input}
                                    value={passwords.confirm}
                                    onChangeText={(text) => setPasswords({ ...passwords, confirm: text })}
                                    placeholder="Repeat New Password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry
                                />
                            </View>
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => {
                                    setIsEditingName(false);
                                    setIsChangingPassword(false);
                                }}
                            >
                                <Text style={styles.cancelBtnText}>Discard</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={isEditingName ? handleSaveName : handleChangePassword}
                            >
                                <Text style={styles.saveBtnText}>Apply Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    container: {
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
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: 40,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '800',
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginTop: 20,
        marginLeft: 4,
    },
    sectionCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.text,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    itemValue: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
    },
    modalIndicator: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 24,
    },
    modalInputContainer: {
        gap: 12,
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: theme.colors.text,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        height: 56,
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textSecondary,
    },
    saveBtn: {
        flex: 2,
        height: 56,
        backgroundColor: theme.colors.primary,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: theme.colors.white,
    },
});
