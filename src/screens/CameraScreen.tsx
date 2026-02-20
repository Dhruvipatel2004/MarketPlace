import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Image } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { X, RotateCcw, Check } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CameraScreen({ navigation, route }: any) {
    const { source, product } = route.params || {};
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const camera = useRef<Camera>(null);

    const [photo, setPhoto] = useState<string | null>(null);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    const takePhoto = async () => {
        if (camera.current) {
            try {
                const file = await camera.current.takePhoto({
                    flash: 'off',
                });
                setPhoto(`file://${file.path}`);
                setIsActive(false);
            } catch {
                Alert.alert('Error', 'Failed to take photo');
            }
        }
    };

    const handleConfirm = () => {
        if (photo) {
            if (source === 'profile') {
                navigation.navigate('Profile', { capturedImage: photo });
            } else if (source === 'reviews') {
                navigation.navigate('Details', { capturedImage: photo, product });
            } else {
                navigation.goBack();
            }
        }
    };

    const handleRetake = () => {
        setPhoto(null);
        setIsActive(true);
    };

    if (!hasPermission) {
        return (
            <View style={styles.center}>
                <Text style={styles.text}>No Camera Permission</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!device) {
        return (
            <View style={styles.center}>
                <Text style={styles.text}>No camera device found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {photo ? (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: photo }} style={styles.preview} />
                    <View style={styles.controls}>
                        <TouchableOpacity style={styles.controlButton} onPress={handleRetake}>
                            <RotateCcw size={32} color={theme.colors.white} />
                            <Text style={styles.controlText}>Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.controlButton, styles.confirmButton]} onPress={handleConfirm}>
                            <Check size={32} color={theme.colors.white} />
                            <Text style={styles.controlText}>Use Photo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <>
                    <Camera
                        ref={camera}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={isActive}
                        photo={true}
                    />
                    <SafeAreaView style={styles.overlay}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => navigation.goBack()}
                        >
                            <X size={28} color={theme.colors.white} />
                        </TouchableOpacity>

                        <View style={styles.bottomControls}>
                            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                                <View style={styles.captureInner} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    text: {
        ...theme.typography.body,
        marginBottom: theme.spacing.md,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.roundness.md,
    },
    buttonText: {
        ...theme.typography.body,
        color: theme.colors.white,
        fontWeight: 'bold',
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        padding: theme.spacing.lg,
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomControls: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff',
    },
    previewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    preview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        paddingHorizontal: 20,
    },
    controlButton: {
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 15,
        borderRadius: 20,
        minWidth: 120,
    },
    confirmButton: {
        backgroundColor: theme.colors.primary,
    },
    controlText: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
});
