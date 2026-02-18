/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps,
} from 'react-native';
import { theme } from '../../styles/theme';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'medium',
    loading = false,
    style,
    textStyle,
    icon,
    disabled,
    ...props
}) => {
    const getVariantStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondary;
            case 'outline':
                return styles.outline;
            case 'text':
                return styles.textVariant;
            default:
                return styles.primary;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'outline':
                return styles.outlineText;
            case 'text':
                return styles.textVariantText;
            default:
                return styles.primaryText;
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return styles.small;
            case 'large':
                return styles.large;
            default:
                return styles.medium;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.base,
                getVariantStyle(),
                getSizeStyle(),
                disabled && styles.disabled,
                style,
            ]}
            disabled={disabled || loading}
            activeOpacity={0.8}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'text' ? theme.colors.primary : theme.colors.white}
                    size="small"
                />
            ) : (
                <>
                    {icon && icon}
                    <Text style={[styles.baseText, getTextStyle(), textStyle, icon ? { marginLeft: 8 } : {}]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: theme.roundness.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    baseText: {
        ...theme.typography.button,
    },
    primary: {
        backgroundColor: theme.colors.primary,
    },
    primaryText: {
        color: theme.colors.white,
    },
    secondary: {
        backgroundColor: theme.colors.secondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    outlineText: {
        color: theme.colors.primary,
    },
    textVariant: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
    },
    textVariantText: {
        color: theme.colors.primary,
    },
    small: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    medium: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default React.memo(Button);
