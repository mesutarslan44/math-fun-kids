import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentTheme } from '../utils/ThemeManager';

const { width, height } = Dimensions.get('window');

const Cloud = ({ x, y, scale = 1, opacity = 0.8 }) => (
    <Svg height={100 * scale} width={200 * scale} style={{ position: 'absolute', top: y, left: x, opacity }}>
        <Circle cx={50 * scale} cy={50 * scale} r={40 * scale} fill="white" />
        <Circle cx={90 * scale} cy={40 * scale} r={45 * scale} fill="white" />
        <Circle cx={130 * scale} cy={50 * scale} r={40 * scale} fill="white" />
        <Rect x={50 * scale} y={50 * scale} width={80 * scale} height={40 * scale} fill="white" />
    </Svg>
);

const Background = ({ children }) => {
    const [themeColors, setThemeColors] = useState(['#87CEEB', '#E0F6FF']);

    const loadTheme = useCallback(async () => {
        const theme = await getCurrentTheme();
        setThemeColors(theme.colors);
    }, []);

    // Load theme on mount
    useEffect(() => {
        loadTheme();
    }, [loadTheme]);

    // Refresh theme when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadTheme();
        }, [loadTheme])
    );

    const isSpaceTheme = themeColors[0] === '#1a1a2e';
    const sunColor = isSpaceTheme ? '#FFF' : '#FFD700';
    const sunOpacity = isSpaceTheme ? 0.3 : 0.9;
    const cloudOpacity = isSpaceTheme ? 0.1 : 0.7;

    return (
        <View style={[styles.container, { backgroundColor: themeColors[0] }]}>
            <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
                <Defs>
                    <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor={themeColors[0]} />
                        <Stop offset="100%" stopColor={themeColors[1]} />
                    </LinearGradient>
                </Defs>

                {/* Gradient Background */}
                <Rect x="0" y="0" width={width} height={height} fill="url(#gradient)" />

                {/* Sun or Moon */}
                <Circle cx={width - 50} cy={80} r={40} fill={sunColor} opacity={sunOpacity} />

                {/* Stars for space theme */}
                {isSpaceTheme && (
                    <>
                        <Circle cx={50} cy={100} r={2} fill="white" opacity={0.8} />
                        <Circle cx={150} cy={50} r={1.5} fill="white" opacity={0.7} />
                        <Circle cx={250} cy={150} r={2} fill="white" opacity={0.8} />
                        <Circle cx={100} cy={200} r={1} fill="white" opacity={0.6} />
                        <Circle cx={width - 100} cy={180} r={2} fill="white" opacity={0.9} />
                        <Circle cx={width - 150} cy={250} r={1.5} fill="white" opacity={0.7} />
                    </>
                )}
            </Svg>

            {/* Clouds (hidden in space theme) */}
            {!isSpaceTheme && (
                <>
                    <Cloud x={20} y={100} scale={0.8} opacity={cloudOpacity * 0.9} />
                    <Cloud x={width - 150} y={50} scale={0.6} opacity={cloudOpacity * 0.8} />
                    <Cloud x={width / 2 - 50} y={200} scale={1.2} opacity={cloudOpacity * 0.5} />
                    <Cloud x={-20} y={height - 200} scale={0.9} opacity={cloudOpacity * 0.6} />
                </>
            )}

            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        zIndex: 1,
    },
});

export default Background;
