import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Settings, Gift, Trophy, Palette, RefreshCw, Brain, Eye, Box, BookOpen } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Mascot from '../components/Mascot';
import Confetti from '../components/Confetti';
import theme from '../constants/theme';
import { checkDailyReward, claimDailyReward } from '../utils/DailyRewardManager';
import { playSuccess, playSelection } from '../utils/SoundManager';

const CHARACTERS = ['robot', 'cat', 'dino', 'fox', 'bunny', 'bear', 'lion', 'owl', 'panda', 'unicorn'];
const CHARACTER_NAMES = {
    robot: 'Robi 🤖',
    cat: 'Mırnav 🐱',
    dino: 'Dino 🦖',
    fox: 'Tilki 🦊',
    bunny: 'Pamuk 🐰',
    bear: 'Boncuk 🐻',
    lion: 'Kral 🦁',
    owl: 'Bilge 🦉',
    panda: 'Po 🐼',
    unicorn: 'Gökkuşağı 🦄',
};
const UNLOCK_SCORES = {
    robot: 0,
    cat: 50,
    dino: 100,
    fox: 200,
    bunny: 350,
    bear: 500,
    lion: 700,
    owl: 1000,
    panda: 1500,
    unicorn: 2000,
};

const QUICK_PLAY_MODES = [
    { id: 'addition', title: 'Toplama', icon: '+', color: theme.colors.secondary },
    { id: 'subtraction', title: 'Çıkarma', icon: '-', color: theme.colors.orange },
    { id: 'multiplication', title: 'Çarpma', icon: '×', color: theme.colors.purple },
    { id: 'division', title: 'Bölme', icon: '÷', color: theme.colors.accent },
];

const DIFFICULTY_LEVELS = [
    { id: 'easy', label: 'Kolay', emoji: '⭐', color: '#6BCB77' },
    { id: 'medium', label: 'Orta', emoji: '⭐⭐', color: '#FF9F1C' },
    { id: 'hard', label: 'Zor', emoji: '⭐⭐⭐', color: '#FF6B6B' },
    { id: 'expert', label: 'Uzman', emoji: '⭐⭐⭐⭐', color: '#9B59B6' },
    { id: 'master', label: 'Usta', emoji: '🏆', color: '#E74C3C' },
];

const HomeScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const [reward, setReward] = useState(null);
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [selectedMode, setSelectedMode] = useState(null);
    const [character, setCharacter] = useState('robot');
    const [unlockedCharacters, setUnlockedCharacters] = useState(['robot']);

    useEffect(() => {
        loadCharacterAndProgress();
        checkReward();
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 6,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const loadCharacterAndProgress = async () => {
        try {
            const savedScore = await AsyncStorage.getItem('totalScore');
            const savedChar = await AsyncStorage.getItem('selectedCharacter');
            const currentScore = savedScore ? parseInt(savedScore) : 0;

            const unlocked = CHARACTERS.filter(c => currentScore >= UNLOCK_SCORES[c]);
            setUnlockedCharacters(unlocked);

            if (savedChar && unlocked.includes(savedChar)) {
                setCharacter(savedChar);
            }
        } catch (e) {
            console.error('Failed to load character', e);
        }
    };

    const checkReward = async () => {
        const result = await checkDailyReward();
        if (result.available) {
            setReward(result);
            setTimeout(() => setShowRewardModal(true), 1000);
        }
    };

    const handleClaimReward = async () => {
        if (reward) {
            await claimDailyReward();
            setShowRewardModal(false);
            setShowConfetti(true);
            playSuccess();
            setTimeout(() => setShowConfetti(false), 3000);
        }
    };

    const changeCharacter = async () => {
        playSelection();
        const currentIndex = unlockedCharacters.indexOf(character);
        const nextIndex = (currentIndex + 1) % unlockedCharacters.length;
        const nextChar = unlockedCharacters[nextIndex];
        setCharacter(nextChar);
        await AsyncStorage.setItem('selectedCharacter', nextChar);
    };

    const handleModeSelect = (mode) => {
        playSelection();
        setSelectedMode(mode);
    };

    const handleDifficultySelect = async (difficulty) => {
        playSelection();
        navigation.navigate('Game', { mode: selectedMode, difficulty: difficulty });
        setSelectedMode(null);
    };

    return (
        <Layout style={styles.container}>
            {showConfetti && <Confetti />}

            {/* Daily Reward Modal */}
            {showRewardModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Gift size={64} color={theme.colors.secondary} />
                        <Text style={styles.modalTitle}>Günlük Ödül!</Text>
                        <Text style={styles.modalText}>
                            Her gün gel, puanları topla!
                        </Text>
                        <Text style={styles.rewardAmount}>+{reward?.amount} Puan</Text>
                        <Button
                            title="Topla"
                            onPress={handleClaimReward}
                            color={theme.colors.success}
                            textColor={theme.colors.white}
                            style={{ width: '100%', marginTop: 20 }}
                        />
                    </View>
                </View>
            )}

            {/* Difficulty Selection Modal */}
            <Modal
                visible={selectedMode !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedMode(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.difficultyModal}>
                        <Text style={styles.difficultyTitle}>Zorluk Seç</Text>
                        <Text style={styles.difficultySubtitle}>
                            {QUICK_PLAY_MODES.find(m => m.id === selectedMode)?.title}
                        </Text>

                        {DIFFICULTY_LEVELS.map((level) => (
                            <TouchableOpacity
                                key={level.id}
                                style={[styles.difficultyBtn, { backgroundColor: level.color }]}
                                onPress={() => handleDifficultySelect(level.id)}
                            >
                                <Text style={styles.difficultyBtnText}>{level.emoji}</Text>
                                <Text style={styles.difficultyBtnLabel}>{level.label}</Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => setSelectedMode(null)}
                        >
                            <Text style={styles.cancelBtnText}>İptal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Header Icons */}
            <View style={styles.headerIcons}>
                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => navigation.navigate('Achievements')}
                >
                    <Trophy color={theme.colors.gold} size={24} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => navigation.navigate('ThemeStore')}
                >
                    <Palette color={theme.colors.purple} size={24} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => navigation.navigate('ParentInfo')}
                >
                    <BookOpen color={theme.colors.accent} size={24} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Settings color={theme.colors.textLight} size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header with Mascot */}
                <View style={styles.header}>
                    <View style={styles.mascotSection}>
                        <Mascot type={character} emotion="happy" style={{ marginBottom: 5 }} />
                        <TouchableOpacity style={styles.changeCharBtn} onPress={changeCharacter}>
                            <RefreshCw color={theme.colors.white} size={14} />
                            <Text style={styles.changeCharText}>Değiştir</Text>
                        </TouchableOpacity>
                        <Text style={styles.characterName}>{CHARACTER_NAMES[character]}</Text>
                    </View>

                    <Animated.Text style={[styles.title, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        Bilsem ve Eğlenceli Matematik
                    </Animated.Text>
                </View>

                {/* Featured Modes */}
                <View style={styles.featuredSection}>
                    {/* BİLSEM Special Card */}
                    <TouchableOpacity
                        style={[styles.bilsemCard]}
                        onPress={() => navigation.navigate('BilsemLevels')}
                    >
                        <View style={styles.bilsemContent}>
                            <Brain color={theme.colors.white} size={32} />
                            <View style={styles.bilsemTextSection}>
                                <Text style={styles.bilsemTitle}>🧠 BİLSEM Zeka Soruları</Text>
                                <Text style={styles.bilsemDesc}>10 seviye • Akıl oyunları • Örüntü ve mantık</Text>
                            </View>
                        </View>
                        <Text style={styles.bilsemBadge}>YENİ</Text>
                    </TouchableOpacity>

                    {/* Görsel Hafıza Card */}
                    <TouchableOpacity
                        style={[styles.memoryCard]}
                        onPress={() => navigation.navigate('MemoryLevels')}
                    >
                        <View style={styles.bilsemContent}>
                            <Eye color={theme.colors.white} size={32} />
                            <View style={styles.bilsemTextSection}>
                                <Text style={styles.bilsemTitle}>👁️ Görsel Hafıza</Text>
                                <Text style={styles.bilsemDesc}>10 seviye • Kart eşleştir • Odaklanma & Bellek</Text>
                            </View>
                        </View>
                        <Text style={styles.memoryBadge}>YENİ</Text>
                    </TouchableOpacity>

                    {/* Küp Sayma Card */}
                    <TouchableOpacity
                        style={[styles.cubeCard]}
                        onPress={() => navigation.navigate('CubeLevels')}
                    >
                        <View style={styles.bilsemContent}>
                            <Box color={theme.colors.white} size={32} />
                            <View style={styles.bilsemTextSection}>
                                <Text style={styles.bilsemTitle}>📦 Küp Sayma</Text>
                                <Text style={styles.bilsemDesc}>10 seviye • Blok say • 3 Boyutlu Düşünme</Text>
                            </View>
                        </View>
                        <Text style={styles.cubeBadge}>YENİ</Text>
                    </TouchableOpacity>

                    {/* Yansıma/Simetri Card */}
                    <TouchableOpacity
                        style={[styles.symmetryCard]}
                        onPress={() => navigation.navigate('SymmetryLevels')}
                    >
                        <View style={styles.bilsemContent}>
                            <Text style={styles.symmetryIcon}>🪞</Text>
                            <View style={styles.bilsemTextSection}>
                                <Text style={styles.bilsemTitle}>🔄 Yansıma / Simetri</Text>
                                <Text style={styles.bilsemDesc}>10 seviye • Ayna görüntüsü • Uzamsal Algı</Text>
                            </View>
                        </View>
                        <Text style={styles.symmetryBadge}>YENİ</Text>
                    </TouchableOpacity>

                    {/* Şifreleme Card */}
                    <TouchableOpacity
                        style={[styles.cipherCard]}
                        onPress={() => navigation.navigate('CipherLevels')}
                    >
                        <View style={styles.bilsemContent}>
                            <Text style={styles.cipherIcon}>🔐</Text>
                            <View style={styles.bilsemTextSection}>
                                <Text style={styles.bilsemTitle}>🧩 Şifreleme</Text>
                                <Text style={styles.bilsemDesc}>10 seviye • Sembol çöz • Soyut Düşünme</Text>
                            </View>
                        </View>
                        <Text style={styles.cipherBadge}>YENİ</Text>
                    </TouchableOpacity>

                    {/* Gölge Card */}
                    <TouchableOpacity
                        style={[styles.shadowCard]}
                        onPress={() => navigation.navigate('ShadowLevels')}
                    >
                        <View style={styles.bilsemContent}>
                            <Text style={styles.shadowIcon}>👤</Text>
                            <View style={styles.bilsemTextSection}>
                                <Text style={styles.bilsemTitle}>🔍 Gölge</Text>
                                <Text style={styles.bilsemDesc}>10 seviye • Silüet bul • Dikkat</Text>
                            </View>
                        </View>
                        <Text style={styles.shadowBadge}>YENİ</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Play Section */}
                <View style={styles.quickPlaySection}>
                    <Text style={styles.sectionTitle}>🎮 Hızlı Oyun</Text>
                    <Text style={styles.sectionSubtitle}>İstediğin işlemi ve zorluğu seç!</Text>

                    <View style={styles.quickPlayGrid}>
                        {QUICK_PLAY_MODES.map((mode) => (
                            <TouchableOpacity
                                key={mode.id}
                                style={[styles.quickPlayCard, { backgroundColor: mode.color }]}
                                onPress={() => handleModeSelect(mode.id)}
                            >
                                <Text style={styles.quickPlayIcon}>{mode.icon}</Text>
                                <Text style={styles.quickPlayLabel}>{mode.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    headerIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    iconBtn: {
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 14,
        elevation: 2,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        alignItems: 'center',
        marginBottom: 15,
    },
    mascotSection: {
        alignItems: 'center',
        marginBottom: 10,
    },
    changeCharBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.accent,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        gap: 5,
        marginTop: -10,
        zIndex: 10,
    },
    changeCharText: {
        color: theme.colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    characterName: {
        fontSize: 14,
        color: theme.colors.text,
        marginTop: 5,
        fontWeight: '600',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme.colors.primary,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    featuredSection: {
        marginBottom: 20,
    },
    featuredRow: {
        flexDirection: 'row',
        gap: 12,
    },
    featuredCard: {
        flex: 1,
        paddingVertical: 20,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 4,
    },
    featuredIcon: {
        fontSize: 28,
        marginBottom: 5,
    },
    featuredTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.white,
    },
    featuredDesc: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    quickPlaySection: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 24,
        padding: 20,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
    },
    sectionSubtitle: {
        fontSize: 14,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginBottom: 15,
    },
    quickPlayGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    quickPlayCard: {
        width: '47%',
        paddingVertical: 25,
        borderRadius: 18,
        alignItems: 'center',
        elevation: 3,
    },
    quickPlayIcon: {
        fontSize: 36,
        color: theme.colors.white,
        fontWeight: 'bold',
    },
    quickPlayLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.white,
        marginTop: 5,
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    modalContent: {
        backgroundColor: theme.colors.white,
        padding: 30,
        borderRadius: 24,
        alignItems: 'center',
        width: '85%',
        elevation: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginTop: 10,
    },
    modalText: {
        fontSize: 16,
        color: theme.colors.text,
        textAlign: 'center',
        marginTop: 5,
    },
    rewardAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.gold,
        marginTop: 10,
    },
    difficultyModal: {
        backgroundColor: theme.colors.white,
        padding: 25,
        borderRadius: 24,
        alignItems: 'center',
        width: '85%',
        elevation: 10,
    },
    difficultyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    difficultySubtitle: {
        fontSize: 16,
        color: theme.colors.textLight,
        marginBottom: 20,
    },
    difficultyBtn: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        marginBottom: 12,
        gap: 10,
    },
    difficultyBtnText: {
        fontSize: 18,
    },
    difficultyBtnLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.white,
    },
    cancelBtn: {
        marginTop: 5,
        padding: 12,
    },
    cancelBtnText: {
        fontSize: 16,
        color: theme.colors.textLight,
    },
    bilsemCard: {
        backgroundColor: theme.colors.purple,
        borderRadius: 20,
        padding: 18,
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 5,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    bilsemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    bilsemTextSection: {
        flex: 1,
    },
    bilsemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.white,
    },
    bilsemDesc: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    bilsemBadge: {
        backgroundColor: theme.colors.secondary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.white,
        overflow: 'hidden',
    },
    memoryCard: {
        backgroundColor: theme.colors.accent,
        borderRadius: 20,
        padding: 18,
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 5,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    memoryBadge: {
        backgroundColor: theme.colors.success,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.white,
        overflow: 'hidden',
    },
    cubeCard: {
        backgroundColor: theme.colors.orange,
        borderRadius: 20,
        padding: 18,
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 5,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    cubeBadge: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.white,
        overflow: 'hidden',
    },
    symmetryCard: {
        backgroundColor: '#9B59B6',
        borderRadius: 20,
        padding: 18,
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 5,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    symmetryIcon: {
        fontSize: 28,
        marginRight: 8,
    },
    symmetryBadge: {
        backgroundColor: '#E74C3C',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.white,
        overflow: 'hidden',
    },
    cipherCard: {
        backgroundColor: '#16A085',
        borderRadius: 20,
        padding: 18,
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 5,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    cipherIcon: {
        fontSize: 28,
        marginRight: 8,
    },
    cipherBadge: {
        backgroundColor: '#1ABC9C',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.white,
        overflow: 'hidden',
    },
    shadowCard: {
        backgroundColor: '#2C3E50',
        borderRadius: 20,
        padding: 18,
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 5,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    shadowIcon: {
        fontSize: 28,
        marginRight: 8,
    },
    shadowBadge: {
        backgroundColor: '#34495E',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.white,
        overflow: 'hidden',
    },
});

export default HomeScreen;
