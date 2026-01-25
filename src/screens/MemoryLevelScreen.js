import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Eye, Lock, Star, ChevronRight, Trophy, Clock } from 'lucide-react-native';
import Layout from '../components/Layout';
import theme from '../constants/theme';
import { getMemoryLevelsWithStatus } from '../utils/MemoryManager';
import { playSelection, playFailure } from '../utils/SoundManager';

const MemoryLevelScreen = ({ navigation }) => {
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadLevels = async () => {
        setLoading(true);
        const data = await getMemoryLevelsWithStatus();
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
        navigation.navigate('MemoryGame', { levelId: level.id });
    };

    const completedCount = levels.filter(l => l.progress?.completed).length;

    const formatTime = (ms) => {
        if (!ms) return '--';
        const seconds = Math.floor(ms / 1000);
        return `${seconds}s`;
    };

    return (
        <Layout>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backBtnText}>←</Text>
                </TouchableOpacity>

                <View style={styles.titleSection}>
                    <Eye color={theme.colors.accent} size={32} />
                    <Text style={styles.title}>Görsel Hafıza</Text>
                </View>

                <View style={styles.progressBadge}>
                    <Trophy color={theme.colors.gold} size={16} />
                    <Text style={styles.progressText}>{completedCount}/10</Text>
                </View>
            </View>

            <Text style={styles.subtitle}>👁️ Odaklanma & Bellek</Text>
            <Text style={styles.description}>
                Kartları eşleştir, hafızanı güçlendir!
            </Text>

            <ScrollView
                contentContainerStyle={styles.levelsContainer}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadLevels} />}
                showsVerticalScrollIndicator={false}
            >
                {levels.map((level) => (
                    <TouchableOpacity
                        key={level.id}
                        style={[
                            styles.levelCard,
                            level.locked && styles.lockedCard,
                            level.progress?.completed && styles.completedCard,
                        ]}
                        onPress={() => handleLevelPress(level)}
                        activeOpacity={level.locked ? 1 : 0.8}
                    >
                        <View style={styles.levelLeft}>
                            <View style={[
                                styles.levelNumber,
                                level.locked && styles.lockedNumber,
                                level.progress?.completed && styles.completedNumber,
                            ]}>
                                {level.locked ? (
                                    <Lock color={theme.colors.textLight} size={20} />
                                ) : (
                                    <Text style={styles.levelNumText}>{level.id}</Text>
                                )}
                            </View>

                            <View style={styles.levelInfo}>
                                <Text style={[
                                    styles.levelTitle,
                                    level.locked && styles.lockedText
                                ]}>
                                    {level.title}
                                </Text>
                                <Text style={[
                                    styles.levelDesc,
                                    level.locked && styles.lockedText
                                ]}>
                                    {level.description}
                                </Text>

                                {level.progress?.completed && (
                                    <View style={styles.statsRow}>
                                        <View style={styles.statItem}>
                                            <Star size={12} color={theme.colors.gold} fill={theme.colors.gold} />
                                            <Text style={styles.statText}>{level.progress.bestMoves} hamle</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Clock size={12} color={theme.colors.accent} />
                                            <Text style={styles.statText}>{formatTime(level.progress.bestTime)}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>

                        {!level.locked && (
                            <ChevronRight
                                color={level.progress?.completed ? theme.colors.success : theme.colors.textLight}
                                size={24}
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    backBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
    },
    backBtnText: {
        fontSize: 24,
        color: theme.colors.text,
    },
    titleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.accent,
    },
    progressBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    progressText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginBottom: 15,
    },
    levelsContainer: {
        paddingBottom: 20,
        gap: 12,
    },
    levelCard: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 18,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.accent,
    },
    lockedCard: {
        backgroundColor: 'rgba(200,200,200,0.5)',
        borderLeftColor: theme.colors.textLight,
    },
    completedCard: {
        borderLeftColor: theme.colors.success,
    },
    levelLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    levelNumber: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    lockedNumber: {
        backgroundColor: 'rgba(150,150,150,0.5)',
    },
    completedNumber: {
        backgroundColor: theme.colors.success,
    },
    levelNumText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.white,
    },
    levelInfo: {
        flex: 1,
    },
    levelTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    levelDesc: {
        fontSize: 13,
        color: theme.colors.textLight,
        marginTop: 2,
    },
    lockedText: {
        color: 'rgba(100,100,100,0.6)',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 5,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 11,
        color: theme.colors.textLight,
    },
});

export default MemoryLevelScreen;
