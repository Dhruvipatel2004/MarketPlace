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
    Save,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import { useUserStore } from '../store/useUserStore';
import { getData, saveData } from '../utils/storage';
import Button from '../components/common/Button';

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
            // Update AsyncStorage for cross-session/login persistence
            const registeredUsers = await getData("registered_users") || [];
            const updatedUsers = registeredUsers.map((u: any) =>
                u.email.toLowerCase() === user?.email.toLowerCase()
                    ? { ...u, name: newName.trim() }
                    : u
            );
            await saveData("registered_users", updatedUsers);

            // Update local state
            updateName(newName.trim());
            setIsEditingName(false);
            Alert.alert('Success', 'Profile name updated');
        } catch (error) {
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
        if (passwords.current === passwords.new) {
            Alert.alert('Error', 'New password must be different from the current password');
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
        } catch (error) {
            Alert.alert('Error', 'Failed to update password');
        }
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={{ width: 40 }} />
        </View>
    );

    const renderSection = (title: string, children: React.ReactNode) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.card}>
                {children}
            </View>
        </View>
    );

    const renderItem = (icon: any, label: string, value?: any, onPress?: () => void, isLast = false) => (
        <TouchableOpacity
            style={[styles.item, isLast && { borderBottomWidth: 0 }]}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.itemLeft}>
                <View style={styles.iconContainer}>
                    {icon}
                </View>
                <Text style={styles.itemLabel}>{label}</Text>
            </View>
            <View style={styles.itemRight}>
                {typeof value === 'boolean' ? (
                    <Switch
                        value={value}
                        onValueChange={onPress as any}
                        trackColor={{ false: '#d1d1d1', true: theme.colors.primary }}
                    />
                ) : (
                    <>
                        {value && <Text style={styles.itemValue}>{value}</Text>}
                        {onPress && <ChevronRight size={20} color={theme.colors.textSecondary} />}
                    </>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {renderHeader()}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Account Section */}
                {renderSection('Account', (
                    <>
                        {renderItem(
                            <User size={20} color={theme.colors.primary} />,
                            'Username',
                            user?.name,
                            () => {
                                setNewName(user?.name || '');
                                setIsEditingName(true);
                            }
                        )}
                        {renderItem(
                            <Lock size={20} color={theme.colors.primary} />,
                            'Change Password',
                            null,
                            () => setIsChangingPassword(true),
                            true
                        )}
                    </>
                ))}

                {/* Notifications Section */}
                {renderSection('Notifications', (
                    <>
                        {renderItem(
                            <Bell size={20} color={theme.colors.primary} />,
                            'Push Notifications',
                            pushEnabled,
                            () => setPushEnabled(!pushEnabled)
                        )}
                        {renderItem(
                            <Bell size={20} color={theme.colors.primary} />,
                            'Email Notifications',
                            emailEnabled,
                            () => setEmailEnabled(!emailEnabled),
                            true
                        )}
                    </>
                ))}

                {/* Appearance Section */}
                {renderSection('Appearance', (
                    <>
                        {renderItem(
                            <Moon size={20} color={theme.colors.primary} />,
                            'Dark Mode',
                            isDarkMode,
                            () => setIsDarkMode(!isDarkMode),
                            true
                        )}
                    </>
                ))}

                {/* Support Section */}
                {renderSection('Support', (
                    <>
                        {renderItem(
                            <HelpCircle size={20} color={theme.colors.primary} />,
                            'Help Center',
                            null,
                            () => Alert.alert('Help', 'Contacting support...')
                        )}
                        {renderItem(
                            <Info size={20} color={theme.colors.primary} />,
                            'About App',
                            'v1.0.0',
                            undefined,
                            true
                        )}
                    </>
                ))}

            </ScrollView>

            {/* Edit Name Modal */}
            <Modal visible={isEditingName} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Name</Text>
                        <TextInput
                            style={styles.input}
                            value={newName}
                            onChangeText={setNewName}
                            placeholder="Full Name"
                            placeholderTextColor="#999"
                            autoFocus
                        />
                        <View style={styles.modalButtons}>
                            <Button
                                title="Cancel"
                                variant="outline"
                                onPress={() => setIsEditingName(false)}
                                style={styles.modalButton}
                            />
                            <Button
                                title="Save"
                                onPress={handleSaveName}
                                style={styles.modalButton}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Change Password Modal */}
            <Modal visible={isChangingPassword} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Password</Text>
                        <TextInput
                            style={styles.input}
                            value={passwords.current}
                            onChangeText={(text) => setPasswords({ ...passwords, current: text })}
                            placeholder="Current Password"
                            placeholderTextColor="#999"
                            secureTextEntry
                        />
                        <TextInput
                            style={styles.input}
                            value={passwords.new}
                            onChangeText={(text) => setPasswords({ ...passwords, new: text })}
                            placeholder="New Password"
                            placeholderTextColor="#999"
                            secureTextEntry
                        />
                        <TextInput
                            style={styles.input}
                            value={passwords.confirm}
                            onChangeText={(text) => setPasswords({ ...passwords, confirm: text })}
                            placeholder="Confirm New Password"
                            placeholderTextColor="#999"
                            secureTextEntry
                        />
                        <View style={styles.modalButtons}>
                            <Button
                                title="Cancel"
                                variant="outline"
                                onPress={() => setIsChangingPassword(false)}
                                style={styles.modalButton}
                            />
                            <Button
                                title="Update"
                                onPress={handleChangePassword}
                                style={styles.modalButton}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: {
        padding: theme.spacing.xs,
    },
    headerTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
    },
    scrollContent: {
        padding: theme.spacing.md,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.caption,
        fontWeight: 'bold',
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        overflow: 'hidden',
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    itemLabel: {
        ...theme.typography.body,
        fontSize: 15,
        color: theme.colors.text,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemValue: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginRight: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: theme.spacing.xl,
    },
    modalContent: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    modalTitle: {
        ...theme.typography.h2,
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.roundness.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        fontSize: 16,
        color: theme.colors.text,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
    },
    modalButton: {
        flex: 1,
    },
});
