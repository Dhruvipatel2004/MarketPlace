import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    StatusBar,
} from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../styles/theme';

import { useUserStore } from '../store/useUserStore';

// const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }: any) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            if (user) {
                navigation.replace('Tabs');
            } else {
                navigation.replace('Login');
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [fadeAnim, scaleAnim, navigation, user]);


    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <LinearGradient
                colors={[theme.colors.primary, '#283593', '#1A237E']}
                style={styles.gradient}
            >
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <View style={styles.iconContainer}>
                        <ShoppingBag size={64} color={theme.colors.accent} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.title}>MarketPlace</Text>
                    <Text style={styles.subtitle}>Premium Shopping Experience</Text>
                </Animated.View>

                <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                    <Text style={styles.version}>v1.0.0</Text>
                </Animated.View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: theme.colors.white,
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: theme.spacing.xs,
        letterSpacing: 1.5,
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    version: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
    },
});

export default SplashScreen;
