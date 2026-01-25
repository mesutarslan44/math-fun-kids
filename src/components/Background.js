import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentTheme } from '../utils/ThemeManager';

const { width, height } = Dimensions.get('window');

const Background = ({ children }) => {
    const [themeColors, setThemeColors] = useState(['#87CEEB', '#E0F6FF']);

    const loadTheme = useCallback(async () => {
        const theme = await getCurrentTheme();
        setThemeColors(theme.colors);
    }, []);

    useEffect(() => {
        loadTheme();
    }, [loadTheme]);

    useFocusEffect(
        useCallback(() => {
            loadTheme();
        }, [loadTheme])
    );

    return (
        <LinearGradient
            colors={themeColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>
                {children}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
    },
    content: {
        flex: 1,
    },
});

export default Background;
