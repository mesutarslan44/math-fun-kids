import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import theme from '../constants/theme';

const Button = ({ onPress, title, color = theme.colors.primary, textColor = theme.colors.text, style }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 4, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]).start();
        onPress && onPress();
    };

    // Darken color for shadow
    const shadowColor = color === theme.colors.white ? '#E0E0E0' : '#C0C0C0'; // Simple fallback, ideally darken hex

    return (
        <Animated.View style={[styles.wrapper, { transform: [{ scale }, { translateY }] }, style]}>
            {/* 3D Shadow Layer */}
            <View style={[styles.shadowLayer, { backgroundColor: shadowColor, borderRadius: theme.borderRadius.xl }]} />

            {/* Main Button Layer */}
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.container, { backgroundColor: color }]}
            >
                <Text style={[styles.text, { color: textColor }]}>{title}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        minHeight: 60, // Ensure minimum touch area
        justifyContent: 'center',
    },
    shadowLayer: {
        position: 'absolute',
        bottom: -4,
        left: 0,
        right: 0,
        height: '100%',
        borderRadius: theme.borderRadius.xl,
    },
    container: {
        paddingVertical: theme.spacing.m,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    text: {
        fontSize: theme.text.subheader.fontSize,
        fontWeight: 'bold',
    },
});

export default Button;
