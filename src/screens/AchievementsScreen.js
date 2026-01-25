import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Trophy, ArrowLeft } from 'lucide-react-native';
import Layout from '../components/Layout';
import theme from '../constants/theme';
import { getAllAchievementsWithStatus } from '../utils/AchievementManager';

const CATEGORY_LABELS = {
    general: '🎯 Genel',
    math: '🔢 Matematik',
    bilsem: '🧠 BİLSEM',
    memory: '👁️ Hafıza',
    cube: '📦 Küp',
    symmetry: '🪞 Simetri',
    cipher: '🔐 Şifre',
    shadow: '👤 Gölge',
    special: '🌟 Özel',
};

const AchievementsScreen = ({ navigation }) => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const loadAchievements = async () => {
        setLoading(true);
        const data = await getAllAchievementsWithStatus();
        setAchievements(data);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadAchievements();
        }, [])
    );

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    // Get unique categories
    const categories = ['all', ...new Set(achievements.map(a => a.category))];

    // Filter by category
    const filteredAchievements = selectedCategory === 'all'
        ? achievements
        : achievements.filter(a => a.category === selectedCategory);

    return (
        <Layout>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft color={theme.colors.text} size={24} />
                </TouchableOpacity>

                <View style={styles.titleRow}>
                    <Trophy color={theme.colors.gold} size={28} />
                    <Text style={styles.title}>Başarımlar</Text>
                </View>

                <View style={styles.countBox}>
                    <Text style={styles.countText}>{unlockedCount}/{achievements.length}</Text>
                </View>
            </View>

            {/* Category Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsContainer}
            >
                <TouchableOpacity
                    style={[styles.tab, selectedCategory === 'all' && styles.activeTab]}
                    onPress={() => setSelectedCategory('all')}
                >
                    <Text style={[styles.tabText, selectedCategory === 'all' && styles.activeTabText]}>
                        🏆 Tümü
                    </Text>
                </TouchableOpacity>

                {categories.filter(c => c !== 'all').map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.tab, selectedCategory === cat && styles.activeTab]}
                        onPress={() => setSelectedCategory(cat)}
                    >
                        <Text style={[styles.tabText, selectedCategory === cat && styles.activeTabText]}>
                            {CATEGORY_LABELS[cat] || cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Achievements List */}
            <ScrollView
                contentContainerStyle={styles.grid}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadAchievements} />}
                showsVerticalScrollIndicator={false}
            >
                {filteredAchievements.map((achievement) => (
                    <View
                        key={achievement.id}
                        style={[
                            styles.card,
                            !achievement.unlocked && styles.lockedCard
                        ]}
                    >
                        <Text style={styles.icon}>
                            {achievement.unlocked ? achievement.icon : '🔒'}
                        </Text>
                        <View style={styles.cardContent}>
                            <Text style={[styles.cardTitle, !achievement.unlocked && styles.lockedText]}>
                                {achievement.title}
                            </Text>
                            <Text style={[styles.cardDesc, !achievement.unlocked && styles.lockedText]}>
                                {achievement.description}
                            </Text>
                        </View>
                        {achievement.unlocked && (
                            <View style={styles.checkmark}>
                                <Text style={styles.checkmarkText}>✓</Text>
                            </View>
                        )}
                    </View>
                ))}

                {filteredAchievements.length === 0 && (
                    <Text style={styles.emptyText}>Bu kategoride başarım yok</Text>
                )}
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    backBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    countBox: {
        backgroundColor: theme.colors.gold,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    countText: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    tabsContainer: {
        paddingBottom: 15,
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tab: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        marginRight: 8,
        height: 36,
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: theme.colors.purple,
    },
    tabText: {
        fontSize: 12,
        color: theme.colors.text,
        fontWeight: '600',
    },
    activeTabText: {
        color: theme.colors.white,
    },
    grid: {
        paddingBottom: 20,
        gap: 12,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
    },
    lockedCard: {
        backgroundColor: 'rgba(200,200,200,0.5)',
    },
    icon: {
        fontSize: 36,
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    cardDesc: {
        fontSize: 13,
        color: theme.colors.textLight,
        marginTop: 2,
    },
    lockedText: {
        color: 'rgba(0,0,0,0.4)',
    },
    checkmark: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: theme.colors.success,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkText: {
        color: theme.colors.white,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: theme.colors.textLight,
        fontSize: 14,
        marginTop: 30,
    },
});

export default AchievementsScreen;
