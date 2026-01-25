import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import Layout from '../components/Layout';
import theme from '../constants/theme';
import { getAudioSettings, setMusicEnabled, setSoundEnabled, playSelection } from '../utils/SoundManager';
import { getAppVersion } from '../utils/AppVersion';
import { Music, Volume2, Info, BarChart2 } from 'lucide-react-native';

const SettingsScreen = ({ navigation }) => {
    const [music, setMusic] = useState(true);
    const [sound, setSound] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const settings = getAudioSettings();
        setMusic(settings.music);
        setSound(settings.sound);
    };

    const toggleMusic = (value) => {
        playSelection();
        setMusic(value);
        setMusicEnabled(value);
    };

    const toggleSound = (value) => {
        if (value) playSelection();
        setSound(value);
        setSoundEnabled(value);
    };

    return (
        <Layout>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Ayarlar</Text>
                </View>

                {/* Audio Section */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <View style={styles.iconLabel}>
                            <Music color={theme.colors.primary} size={24} />
                            <Text style={styles.label}>Müzik</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: theme.colors.success }}
                            thumbColor={music ? theme.colors.white : "#f4f3f4"}
                            onValueChange={toggleMusic}
                            value={music}
                        />
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.row}>
                        <View style={styles.iconLabel}>
                            <Volume2 color={theme.colors.primary} size={24} />
                            <Text style={styles.label}>Ses Efektleri</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: theme.colors.success }}
                            thumbColor={sound ? theme.colors.white : "#f4f3f4"}
                            onValueChange={toggleSound}
                            value={sound}
                        />
                    </View>
                </View>

                {/* Parent Stats Link */}
                <TouchableOpacity
                    style={styles.statsLink}
                    onPress={() => navigation.navigate('ParentStats')}
                >
                    <BarChart2 color={theme.colors.accent} size={24} />
                    <Text style={styles.statsLinkText}>Ebeveyn İstatistikleri</Text>
                </TouchableOpacity>

                <View style={styles.aboutSection}>
                    <Info color={theme.colors.textLight} size={20} style={{ marginBottom: 8 }} />
                    <Text style={styles.aboutTitle}>Bilsem ve Eğlenceli Matematik</Text>
                    <Text style={styles.aboutText}>Versiyon {getAppVersion()}</Text>
                    <Text style={styles.aboutText}>Çocuklar için sevgiyle yapıldı ❤️</Text>
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.closeButtonText}>Tamam</Text>
            </TouchableOpacity>
        </Layout>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        ...theme.text.header,
        color: theme.colors.primary,
    },
    section: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        padding: theme.spacing.l,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.s,
    },
    iconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    label: {
        fontSize: 18,
        color: theme.colors.text,
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginVertical: theme.spacing.m,
    },
    difficultyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        gap: 8,
    },
    difficultyBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
    },
    difficultyText: {
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    statsLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 20,
        padding: 15,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 15,
    },
    statsLinkText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.accent,
    },
    aboutSection: {
        marginTop: 20,
        alignItems: 'center',
        padding: 20,
    },
    aboutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    aboutText: {
        fontSize: 14,
        color: theme.colors.textLight,
        marginBottom: 2,
    },
    closeButton: {
        backgroundColor: theme.colors.secondary,
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        width: '100%',
    },
    closeButtonText: {
        color: theme.colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SettingsScreen;
