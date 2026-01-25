import React, { useRef, memo } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import theme from '../constants/theme';

const Button = memo(({ onPress, title, color = theme.colors.primary, textColor = theme.colors.text, style, accessibilityLabel, accessibilityHint }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 0.92,
                friction: 3,
                tension: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 3,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0.9,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                friction: 4,
                tension: 200,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
        onPress && onPress();
    };

    // Darken color for shadow
    const shadowColor = color === theme.colors.white ? '#E0E0E0' : '#C0C0C0'; // Simple fallback, ideally darken hex

    return (
        <Animated.View style={[styles.wrapper, { transform: [{ scale }, { translateY }], opacity }, style]}>
            {/* 3D Shadow Layer */}
            <Animated.View
                style={[
                    styles.shadowLayer,
                    {
                        backgroundColor: shadowColor,
                        borderRadius: theme.borderRadius.xl,
                        transform: [{ scale: Animated.multiply(scale, 0.95) }],
                    },
                ]}
            />

            {/* Main Button Layer */}
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.container, { backgroundColor: color }]}
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel || title}
                accessibilityHint={accessibilityHint}
            >
                <Text style={[styles.text, { color: textColor }]}>{title}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
});

Button.displayName = 'Button';

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
