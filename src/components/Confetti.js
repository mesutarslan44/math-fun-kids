import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import theme from '../constants/theme';

const { width, height } = Dimensions.get('window');
const NUM_CONFETTI = 50;
const COLORS = [theme.colors.primary, theme.colors.secondary, theme.colors.accent, theme.colors.success, theme.colors.purple, theme.colors.orange];

const Particle = ({ delay }) => {
    const animatedValue = new Animated.Value(0);
    const [config] = useState({
        x: Math.random() * width,
        y: -20,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
    });

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 2000 + Math.random() * 1000,
            delay: delay,
            useNativeDriver: true,
        }).start();
    }, []);

    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, height + 50],
    });

    const rotate = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [`${config.rotation}deg`, `${config.rotation + 360}deg`],
    });

    return (
        <Animated.View
            style={[
                styles.particle,
                {
                    left: config.x,
                    width: config.size,
                    height: config.size,
                    backgroundColor: config.color,
                    transform: [{ translateY }, { rotate }],
                },
            ]}
        />
    );
};

const Confetti = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: NUM_CONFETTI }).map((_, i) => ({
            id: i,
            delay: Math.random() * 500,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <View style={styles.container} pointerEvents="none">
            {particles.map((p) => (
                <Particle key={p.id} delay={p.delay} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
    },
    particle: {
        position: 'absolute',
        borderRadius: 2,
    },
});

export default Confetti;
