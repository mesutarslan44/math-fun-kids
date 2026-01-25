import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Palette, Check } from 'lucide-react-native';
import Layout from '../components/Layout';
import theme from '../constants/theme';
import { getAllThemesWithStatus, setCurrentTheme } from '../utils/ThemeManager';
import { playSuccess, playSelection } from '../utils/SoundManager';

const ThemeStoreScreen = ({ navigation }) => {
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const themesData = await getAllThemesWithStatus();
        setThemes(themesData);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const handleThemePress = async (themeItem) => {
        if (themeItem.active) return;

        playSelection();
        await setCurrentTheme(themeItem.id);
        playSuccess();
        loadData();
    };

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>←</Text>
                </TouchableOpacity>
                <View style={styles.titleRow}>
                    <Palette color={theme.colors.purple} size={28} />
                    <Text style={styles.title}>Tema Seç</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <Text style={styles.subtitle}>Tüm temalar ücretsiz! 🎨</Text>

            <ScrollView
                contentContainerStyle={styles.grid}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
            >
                {themes.map((t) => (
                    <TouchableOpacity
                        key={t.id}
                        style={[
                            styles.themeCard,
                            { borderColor: t.active ? theme.colors.success : 'transparent' }
                        ]}
                        onPress={() => handleThemePress(t)}
                    >
                        <View style={[styles.preview, { backgroundColor: t.colors[0] }]}>
                            <View style={[styles.previewInner, { backgroundColor: t.colors[1] }]}>
                                <Text style={styles.themeIcon}>{t.icon}</Text>
                            </View>
                        </View>

                        <View style={styles.cardContent}>
                            <Text style={styles.themeName}>{t.name}</Text>

                            {t.active ? (
                                <View style={styles.badge}>
                                    <Check size={14} color={theme.colors.white} />
                                    <Text style={styles.badgeText}>Aktif</Text>
                                </View>
                            ) : (
                                <Text style={styles.selectText}>Seç</Text>
                            )}
                        </View>
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
        fontSize: 28,
        color: theme.colors.text,
        padding: 8,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.success,
        textAlign: 'center',
        marginBottom: 15,
        fontWeight: '600',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingBottom: 20,
    },
    themeCard: {
        width: '47%',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        padding: 12,
        borderWidth: 3,
        elevation: 3,
    },
    preview: {
        height: 80,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewInner: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    themeIcon: {
        fontSize: 28,
    },
    cardContent: {
        marginTop: 10,
        alignItems: 'center',
    },
    themeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 5,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: theme.colors.success,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    badgeText: {
        color: theme.colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    selectText: {
        fontSize: 13,
        color: theme.colors.accent,
        fontWeight: '600',
    },
});

export default ThemeStoreScreen;
