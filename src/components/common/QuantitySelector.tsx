import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { theme } from '../../styles/theme';

interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    minQuantity?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    quantity,
    onIncrease,
    onDecrease,
    minQuantity = 1,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onDecrease}
                disabled={quantity <= minQuantity}
                style={[styles.button, quantity <= minQuantity && styles.disabled]}
            >
                <Minus size={16} color={theme.colors.text} />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantity}</Text>

            <TouchableOpacity onPress={onIncrease} style={styles.button}>
                <Plus size={16} color={theme.colors.text} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: theme.roundness.sm,
        alignSelf: 'flex-start',
    },
    button: {
        padding: 8,
    },
    quantityText: {
        paddingHorizontal: 12,
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
        minWidth: 40,
        textAlign: 'center',
    },
    disabled: {
        opacity: 0.3,
    },
});

export default React.memo(QuantitySelector);
