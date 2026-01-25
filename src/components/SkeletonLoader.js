import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import theme from '../constants/theme';

const SkeletonLoader = ({ width = '100%', height = 20, borderRadius = 8, style }) => {
    const shimmerAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        const shimmer = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        );
        shimmer.start();
        return () => shimmer.stop();
    }, []);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                    opacity,
                },
                style,
            ]}
        />
    );
};

export const SkeletonCard = () => (
    <View style={styles.cardContainer}>
        <SkeletonLoader width={60} height={60} borderRadius={30} />
        <View style={styles.cardContent}>
            <SkeletonLoader width="70%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
            <SkeletonLoader width="50%" height={14} borderRadius={4} />
        </View>
    </View>
);

export const SkeletonButton = () => (
    <SkeletonLoader width="100%" height={60} borderRadius={25} />
);

export const SkeletonText = ({ lines = 3 }) => (
    <View>
        {[...Array(lines)].map((_, i) => (
            <SkeletonLoader
                key={i}
                width={i === lines - 1 ? '80%' : '100%'}
                height={16}
                borderRadius={4}
                style={{ marginBottom: 8 }}
            />
        ))}
    </View>
);

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
        marginLeft: 12,
    },
});

export default SkeletonLoader;
