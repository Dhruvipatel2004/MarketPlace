import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';
import Button from './Button';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    buttonTitle?: string;
    onButtonPress?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    subtitle,
    buttonTitle,
    onButtonPress,
}) => {
    return (
        <View style={styles.container}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            {buttonTitle && onButtonPress && (
                <Button
                    title={buttonTitle}
                    onPress={onButtonPress}
                    variant="primary"
                    style={styles.button}
                    size="medium"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.background,
    },
    iconContainer: {
        marginBottom: theme.spacing.lg,
        opacity: 0.5,
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        ...theme.typography.caption,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        color: theme.colors.textSecondary,
    },
    button: {
        borderRadius: theme.roundness.full,
        paddingHorizontal: 40,
    },
});

export default React.memo(EmptyState);
