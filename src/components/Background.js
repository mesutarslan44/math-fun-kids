import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentTheme } from '../utils/ThemeManager';

const { width, height } = Dimensions.get('window');

// Premium arka plan görseli
const PREMIUM_BG = require('../../assets/premium_bg.png');

const Background = ({ children }) => {
    const [themeColors, setThemeColors] = useState(['#667eea', '#764ba2']);
    const [useImage, setUseImage] = useState(true);

    const loadTheme = useCallback(async () => {
        const theme = await getCurrentTheme();
        setThemeColors(theme.colors);
        // Space teması için görsel kullanma
        setUseImage(theme.colors[0] !== '#1a1a2e');
    }, []);

    useEffect(() => {
        loadTheme();
    }, [loadTheme]);

    useFocusEffect(
        useCallback(() => {
            loadTheme();
        }, [loadTheme])
    );

    if (useImage) {
        return (
            <ImageBackground
                source={PREMIUM_BG}
                style={styles.container}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <View style={styles.content}>
                        {children}
                    </View>
                </View>
            </ImageBackground>
        );
    }

    // Fallback for space theme - gradient background
    return (
        <View style={[styles.container, { backgroundColor: themeColors[0] }]}>
            <View style={styles.gradientOverlay}>
                <View style={[styles.gradientTop, { backgroundColor: themeColors[0] }]} />
                <View style={[styles.gradientBottom, { backgroundColor: themeColors[1] }]} />
            </View>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(102, 126, 234, 0.15)', // Hafif mor overlay
    },
    content: {
        flex: 1,
        zIndex: 1,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    gradientTop: {
        flex: 1,
    },
    gradientBottom: {
        flex: 1,
    },
});

export default Background;
