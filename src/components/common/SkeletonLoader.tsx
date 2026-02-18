import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { theme } from '../../styles/theme';

interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = 4,
    style
}) => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [animatedValue]);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: '#E1E9EE',
                    opacity,
                },
                style,
            ]}
        />
    );
};

export const ProductCardSkeleton = () => (
    <View style={styles.cardSkeleton}>
        <Skeleton height={150} borderRadius={theme.roundness.md} />
        <View style={styles.cardContent}>
            <Skeleton width="60%" height={12} style={{ marginTop: 8 }} />
            <Skeleton width="90%" height={16} style={{ marginTop: 8 }} />
            <Skeleton width="40%" height={20} style={{ marginTop: 12 }} />
        </View>
    </View>
);

export const ProductDetailsSkeleton = () => (
    <View style={styles.detailsSkeleton}>
        <Skeleton height={350} borderRadius={0} />
        <View style={styles.detailsContent}>
            <View style={styles.row}>
                <Skeleton width="30%" height={16} />
                <Skeleton width="20%" height={24} />
            </View>
            <Skeleton width="80%" height={32} style={{ marginTop: 16 }} />
            <Skeleton width="40%" height={24} style={{ marginTop: 16 }} />
            <Skeleton width="100%" height={100} style={{ marginTop: 24 }} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    cardSkeleton: {
        width: (Dimensions.get('window').width - theme.spacing.md * 3) / 2,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.md,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    cardContent: {
        padding: theme.spacing.xs,
    },
    detailsSkeleton: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    detailsContent: {
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.roundness.xl,
        borderTopRightRadius: theme.roundness.xl,
        marginTop: -30,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});
