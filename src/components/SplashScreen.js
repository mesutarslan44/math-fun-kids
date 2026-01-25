import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoRotate = useRef(new Animated.Value(0)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleSlide = useRef(new Animated.Value(30)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const iconsOpacity = useRef(new Animated.Value(0)).current;
    const progressWidth = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Pulse animation for background
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Main animation sequence
        Animated.sequence([
            // Logo bounce in with rotation
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(logoRotate, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            // Title slide up and fade in
            Animated.parallel([
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(titleSlide, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            // Subtitle fade in
            Animated.timing(subtitleOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            // Icons fade in
            Animated.timing(iconsOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            // Progress bar
            Animated.timing(progressWidth, {
                toValue: 1,
                duration: 800,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setTimeout(() => {
                onFinish && onFinish();
            }, 300);
        });
    }, []);

    const spin = logoRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {/* Animated decorative circles */}
            <Animated.View
                style={[
                    styles.circle,
                    styles.circle1,
                    { transform: [{ scale: pulseAnim }] }
                ]}
            />
            <Animated.View
                style={[
                    styles.circle,
                    styles.circle2,
                    { transform: [{ scale: pulseAnim }] }
                ]}
            />
            <View style={[styles.circle, styles.circle3]} />
            <View style={[styles.circle, styles.circle4]} />

            {/* Main content */}
            <View style={styles.content}>
                {/* Animated Logo */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            transform: [
                                { scale: logoScale },
                                { rotate: spin },
                            ],
                        },
                    ]}
                >
                    <View style={styles.logoInner}>
                        <Text style={styles.logoEmoji}>🧠</Text>
                    </View>
                    <View style={styles.logoBadge}>
                        <Text style={styles.logoBadgeText}>✨</Text>
                    </View>
                </Animated.View>

                {/* Title */}
                <Animated.Text
                    style={[
                        styles.title,
                        {
                            opacity: titleOpacity,
                            transform: [{ translateY: titleSlide }],
                        },
                    ]}
                >
                    BİLSEM Hazırlık
                </Animated.Text>

                {/* Subtitle */}
                <Animated.Text
                    style={[
                        styles.subtitle,
                        { opacity: subtitleOpacity },
                    ]}
                >
                    Eğlenceli Matematik & Zeka Oyunları
                </Animated.Text>

                {/* Category Icons */}
                <Animated.View
                    style={[
                        styles.iconsRow,
                        { opacity: iconsOpacity },
                    ]}
                >
                    {['🧠', '👁️', '📦', '🪞', '🔐', '👤'].map((icon, index) => (
                        <View key={index} style={styles.iconBox}>
                            <Text style={styles.categoryIcon}>{icon}</Text>
                        </View>
                    ))}
                </Animated.View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            {
                                width: progressWidth.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%'],
                                }),
                            },
                        ]}
                    />
                </View>

                <Animated.Text
                    style={[
                        styles.loadingText,
                        { opacity: iconsOpacity },
                    ]}
                >
                    Yükleniyor...
                </Animated.Text>
            </View>

            {/* Footer */}
            <Animated.Text
                style={[
                    styles.footer,
                    { opacity: subtitleOpacity },
                ]}
            >
                🎓 Özel Yetenekli Çocuklar İçin
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#667eea',
    },
    circle: {
        position: 'absolute',
        borderRadius: 999,
    },
    circle1: {
        width: 350,
        height: 350,
        top: -120,
        left: -100,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    circle2: {
        width: 250,
        height: 250,
        bottom: 30,
        right: -80,
        backgroundColor: 'rgba(155,89,182,0.3)',
    },
    circle3: {
        width: 180,
        height: 180,
        top: height * 0.35,
        left: -60,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    circle4: {
        width: 120,
        height: 120,
        bottom: height * 0.25,
        right: 20,
        backgroundColor: 'rgba(240,147,251,0.2)',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    logoContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    logoInner: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#9B59B6',
    },
    logoEmoji: {
        fontSize: 60,
    },
    logoBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#FFD700',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    logoBadgeText: {
        fontSize: 18,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 35,
    },
    iconsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 40,
    },
    iconBox: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 14,
    },
    categoryIcon: {
        fontSize: 24,
    },
    progressContainer: {
        width: 220,
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 15,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FFD700',
        borderRadius: 4,
    },
    loadingText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
});

export default SplashScreen;
