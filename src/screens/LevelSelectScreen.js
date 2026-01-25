import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Star, Lock, Play } from 'lucide-react-native';
import Layout from '../components/Layout';
import theme from '../constants/theme';
import { getLevels } from '../utils/LevelManager';
import { playSelection, playFailure } from '../utils/SoundManager';

const LevelSelectScreen = ({ navigation }) => {
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadLevels = async () => {
        setLoading(true);
        const data = await getLevels();
        setLevels(data);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadLevels();
        }, [])
    );

    const handleLevelPress = (level) => {
        if (level.locked) {
            playFailure();
            return;
        }
        playSelection();
        navigation.navigate('Game', {
            mode: level.mode,
            levelId: level.id,
            targetStars: level.targetStars
        });
    };

    const renderStars = (count) => {
        return (
            <View style={styles.starContainer}>
                {[1, 2, 3].map((i) => (
                    <Star
                        key={i}
                        size={16}
                        fill={i <= count ? theme.colors.gold : 'transparent'}
                        color={i <= count ? theme.colors.gold : theme.colors.textLight}
                    />
                ))}
            </View>
        );
    };

    return (
        <Layout>
            <View style={styles.header}>
                <Text style={styles.title}>Macera Haritası</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.grid}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadLevels} />}
            >
                {levels.map((level) => (
                    <TouchableOpacity
                        key={level.id}
                        style={[styles.levelCard, level.locked && styles.lockedCard]}
                        onPress={() => handleLevelPress(level)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.iconContainer}>
                            {level.locked ? (
                                <Lock color={theme.colors.textLight} size={32} />
                            ) : (
                                <Text style={styles.levelNumber}>{level.id}</Text>
                            )}
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.levelTitle}>{level.title}</Text>
                            <Text style={styles.levelDesc}>{level.description}</Text>
                            {!level.locked && renderStars(level.stars)}
                        </View>

                        {!level.locked && (
                            <View style={styles.playButton}>
                                <Play fill={theme.colors.white} color={theme.colors.white} size={20} />
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        ...theme.text.header,
        color: theme.colors.primary,
    },
    grid: {
        padding: theme.spacing.m,
        gap: theme.spacing.m,
    },
    levelCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: theme.spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    lockedCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        opacity: 0.8,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.secondaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.m,
    },
    levelNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.secondary,
        fontFamily: theme.fonts.bold,
    },
    infoContainer: {
        flex: 1,
    },
    levelTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    levelDesc: {
        fontSize: 14,
        color: theme.colors.textLight,
        marginBottom: 8,
    },
    starContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    playButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing.s,
    },
});

export default LevelSelectScreen;
