import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart3, Target, Flame, Clock, Trophy } from 'lucide-react-native';
import Layout from '../components/Layout';
import theme from '../constants/theme';
import { getStats } from '../utils/StatsManager';

const ParentStatsScreen = ({ navigation }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        setLoading(true);
        const data = await getStats();
        setStats(data);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );

    const accuracy = stats?.totalQuestionsAnswered > 0
        ? Math.round((stats.correctAnswers / stats.totalQuestionsAnswered) * 100)
        : 0;

    const getModeAccuracy = (mode) => {
        if (!stats?.modeStats[mode]?.played) return 0;
        return Math.round((stats.modeStats[mode].correct / stats.modeStats[mode].played) * 100);
    };

    return (
        <Layout>
            <View style={styles.header}>
                <Text style={styles.title}>📊 İstatistikler</Text>
                <Text style={styles.subtitle}>Ebeveyn Paneli</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadStats} />}
            >
                {/* Summary Cards */}
                <View style={styles.cardRow}>
                    <View style={[styles.card, { backgroundColor: theme.colors.accent }]}>
                        <Target color={theme.colors.white} size={28} />
                        <Text style={styles.cardValue}>{accuracy}%</Text>
                        <Text style={styles.cardLabel}>Doğruluk</Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: theme.colors.secondary }]}>
                        <Flame color={theme.colors.white} size={28} />
                        <Text style={styles.cardValue}>{stats?.streakDays || 0}</Text>
                        <Text style={styles.cardLabel}>Gün Serisi</Text>
                    </View>
                </View>

                <View style={styles.cardRow}>
                    <View style={[styles.card, { backgroundColor: theme.colors.success }]}>
                        <BarChart3 color={theme.colors.white} size={28} />
                        <Text style={styles.cardValue}>{stats?.totalQuestionsAnswered || 0}</Text>
                        <Text style={styles.cardLabel}>Toplam Soru</Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: theme.colors.purple }]}>
                        <Trophy color={theme.colors.white} size={28} />
                        <Text style={styles.cardValue}>{stats?.bestStreak || 0}</Text>
                        <Text style={styles.cardLabel}>En İyi Seri</Text>
                    </View>
                </View>

                {/* Mode Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>İşlem Bazında Performans</Text>

                    {[
                        { key: 'addition', label: 'Toplama', color: theme.colors.secondary },
                        { key: 'subtraction', label: 'Çıkarma', color: theme.colors.orange },
                        { key: 'multiplication', label: 'Çarpma', color: theme.colors.purple },
                        { key: 'division', label: 'Bölme', color: theme.colors.accent },
                    ].map(mode => (
                        <View key={mode.key} style={styles.modeRow}>
                            <Text style={styles.modeLabel}>{mode.label}</Text>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, {
                                    width: `${getModeAccuracy(mode.key)}%`,
                                    backgroundColor: mode.color
                                }]} />
                            </View>
                            <Text style={styles.modePercent}>{getModeAccuracy(mode.key)}%</Text>
                        </View>
                    ))}
                </View>

                {/* Correct/Wrong Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Özet</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>✅ Doğru Cevaplar:</Text>
                        <Text style={styles.summaryValue}>{stats?.correctAnswers || 0}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>❌ Yanlış Cevaplar:</Text>
                        <Text style={styles.summaryValue}>{stats?.wrongAnswers || 0}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>🎮 Oturum Sayısı:</Text>
                        <Text style={styles.summaryValue}>{stats?.sessionsPlayed || 0}</Text>
                    </View>
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
        </Layout>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textLight,
    },
    content: {
        paddingBottom: 20,
    },
    cardRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    card: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 3,
    },
    cardValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.white,
        marginTop: 8,
    },
    cardLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    section: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 12,
    },
    modeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    modeLabel: {
        width: 80,
        fontSize: 14,
        color: theme.colors.text,
    },
    progressBarBg: {
        flex: 1,
        height: 12,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 6,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 6,
    },
    modePercent: {
        width: 40,
        textAlign: 'right',
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    summaryLabel: {
        fontSize: 16,
        color: theme.colors.text,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    closeButton: {
        backgroundColor: theme.colors.secondary,
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: theme.colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ParentStatsScreen;
