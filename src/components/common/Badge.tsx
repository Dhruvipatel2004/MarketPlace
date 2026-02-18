import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../styles/theme';

interface BadgeProps {
    label: string;
    variant?: 'primary' | 'success' | 'error' | 'warning' | 'info';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', style, textStyle }) => {
    const getVariantStyle = () => {
        switch (variant) {
            case 'success':
                return styles.success;
            case 'error':
                return styles.error;
            case 'warning':
                return styles.warning;
            case 'info':
                return styles.info;
            default:
                return styles.primary;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'success':
                return styles.successText;
            case 'error':
                return styles.errorText;
            case 'warning':
                return styles.warningText;
            case 'info':
                return styles.infoText;
            default:
                return styles.primaryText;
        }
    };

    return (
        <View style={[styles.container, getVariantStyle(), style]}>
            <Text style={[styles.text, getTextStyle(), textStyle]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: theme.roundness.sm,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    primary: {
        backgroundColor: theme.colors.primary + '20', // Add transparency
    },
    primaryText: {
        color: theme.colors.primary,
    },
    success: {
        backgroundColor: '#E8F5E9',
    },
    successText: {
        color: '#2E7D32',
    },
    error: {
        backgroundColor: '#FFEBEE',
    },
    errorText: {
        color: theme.colors.error,
    },
    warning: {
        backgroundColor: '#FFF9E6',
    },
    warningText: {
        color: '#FFB800',
    },
    info: {
        backgroundColor: '#E3F2FD',
    },
    infoText: {
        color: '#1976D2',
    },
});

export default React.memo(Badge);
