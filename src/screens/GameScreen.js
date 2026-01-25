import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Mascot from '../components/Mascot';
import Confetti from '../components/Confetti';
import SkeletonLoader, { SkeletonCard, SkeletonButton } from '../components/SkeletonLoader';
import theme from '../constants/theme';
import { generateQuestion } from '../utils/gameLogic';
import { playSuccess, playFailure, playSelection } from '../utils/SoundManager';
import { saveLevelProgress } from '../utils/LevelManager';
import { recordAnswer, recordSession, getStats } from '../utils/StatsManager';
import { checkAndUnlockAchievements } from '../utils/AchievementManager';
import Logger from '../utils/Logger';
import { Star, Lock, Home, RotateCcw } from 'lucide-react-native';

const CHARACTERS = ['robot', 'cat', 'dino', 'fox', 'bunny', 'bear', 'lion', 'owl', 'panda', 'unicorn'];
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

const GameScreen = ({ navigation, route }) => {
    const { mode, levelId, targetStars, difficulty = 'easy' } = route.params || { mode: 'addition', difficulty: 'easy' };
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [isChecking, setIsChecking] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [earnedStars, setEarnedStars] = useState(0);
    const [character, setCharacter] = useState('robot');
    const [unlockedCharacters, setUnlockedCharacters] = useState(['robot']);
    const [feedbackMessage, setFeedbackMessage] = useState('Harika! 🎉');
    const [newAchievement, setNewAchievement] = useState(null);
    const [showAchievementModal, setShowAchievementModal] = useState(false);
    const achievementScale = useRef(new Animated.Value(0)).current;
    const achievementRotation = useRef(new Animated.Value(0)).current;

    // Animation values
    const feedbackScale = useRef(new Animated.Value(0)).current;
    const feedbackOpacity = useRef(new Animated.Value(0)).current;
    const questionShake = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadProgress();
        loadNewQuestion();
        // Record session when game starts
        recordSession();
    }, []);

    const loadProgress = async () => {
        try {
            const savedScore = await AsyncStorage.getItem('totalScore');
            const savedChar = await AsyncStorage.getItem('selectedCharacter');
            const currentScore = savedScore ? parseInt(savedScore) : 0;

            // Determine unlocked characters based on total score (cumulative)
            const unlocked = CHARACTERS.filter(c => currentScore >= UNLOCK_SCORES[c]);

            setUnlockedCharacters(unlocked);
            if (savedChar && unlocked.includes(savedChar)) {
                setCharacter(savedChar);
            }
        } catch (e) {
            Logger.error('Failed to load progress', e);
        }
    };

    const saveProgress = async (pointsToAdd) => {
        try {
            const savedScore = await AsyncStorage.getItem('totalScore');
            const newTotal = (savedScore ? parseInt(savedScore) : 0) + pointsToAdd;
            await AsyncStorage.setItem('totalScore', newTotal.toString());

            // Check for new unlocks
            const newUnlocked = CHARACTERS.filter(c => newTotal >= UNLOCK_SCORES[c]);
            if (newUnlocked.length > unlockedCharacters.length) {
                setUnlockedCharacters(newUnlocked);
                Alert.alert("Tebrikler! 🎉", "Yeni bir karakter açtın! Maskotuna tıklayarak değiştirebilirsin.");
                playSuccess();
            }
        } catch (e) {
            Logger.error('Failed to save progress', e);
        }
    };

    const loadNewQuestion = () => {
        if (levelId && questionsAnswered >= 10) {
            finishLevel();
            return;
        }

        const q = generateQuestion(mode, difficulty);
        setCurrentQuestion(q);
        setIsChecking(false);
        setShowConfetti(false);
        feedbackScale.setValue(0);
        feedbackOpacity.setValue(0);
    };

    const finishLevel = async () => {
        setGameOver(true);
        let stars = 0;
        const accuracy = correctCount / 10;
        if (accuracy === 1) stars = 3;
        else if (accuracy >= 0.8) stars = 2;
        else if (accuracy >= 0.5) stars = 1;

        setEarnedStars(stars);
        if (stars > 0) {
            await saveLevelProgress(levelId, stars);
            playSuccess();
        }
    };

    const handleAnswer = async (selectedOption) => {
        if (isChecking) return;
        setIsChecking(true);
        playSelection();

        const isCorrect = selectedOption === currentQuestion.answer;

        // Record the answer for stats
        await recordAnswer(mode, isCorrect);

        // Check for new achievements
        const stats = await getStats();
        const newAchievements = await checkAndUnlockAchievements(stats);

        // Show achievement animation if new achievement unlocked
        if (newAchievements && newAchievements.length > 0) {
            setNewAchievement(newAchievements[0]);
            setShowAchievementModal(true);
            // Animate achievement modal
            Animated.parallel([
                Animated.spring(achievementScale, {
                    toValue: 1,
                    friction: 3,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.timing(achievementRotation, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(achievementRotation, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();
            // Auto close after 3 seconds
            setTimeout(() => {
                setShowAchievementModal(false);
                achievementScale.setValue(0);
            }, 3000);
        }

        if (isCorrect) {
            // Correct!
            setScore(s => s + 10);
            setStreak(s => s + 1);
            setCorrectCount(c => c + 1);
            setShowConfetti(true);
            playSuccess();
            showFeedback(true);
            saveProgress(10); // Add to persistent total score
            setQuestionsAnswered(q => q + 1);
            setTimeout(loadNewQuestion, 2000); // Longer wait to enjoy confetti
        } else {
            // Wrong!
            setStreak(0);
            playFailure();
            showFeedback(false);
            shakeQuestion();
            setTimeout(() => {
                setIsChecking(false);
                setQuestionsAnswered(q => q + 1);
                loadNewQuestion();
            }, 1000);
        }
    };

    const changeCharacter = async () => {
        const currentIndex = unlockedCharacters.indexOf(character);
        const nextIndex = (currentIndex + 1) % unlockedCharacters.length;
        const nextChar = unlockedCharacters[nextIndex];
        setCharacter(nextChar);
        playSelection();
        await AsyncStorage.setItem('selectedCharacter', nextChar);
    };

    // Doğru cevap mesajları varyasyonu
    const getSuccessMessage = () => {
        const messages = [
            'Harika! 🎉',
            'Mükemmel! ⭐',
            'Süpersin! 🚀',
            'Bravo! 👏',
            'Harika iş! 💪',
            'Çok iyi! 🌟',
            'Muhteşem! 🎯',
            'Tebrikler! 🏆',
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const showFeedback = (isCorrect) => {
        if (isCorrect) {
            const message = getSuccessMessage();
            setFeedbackMessage(message);
            Animated.parallel([
                Animated.spring(feedbackScale, {
                    toValue: 1,
                    useNativeDriver: true,
                }),
                Animated.timing(feedbackOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    const shakeQuestion = () => {
        Animated.sequence([
            Animated.timing(questionShake, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(questionShake, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(questionShake, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(questionShake, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    if (!currentQuestion) {
        return (
            <Layout>
                <View style={styles.loadingContainer}>
                    <SkeletonCard />
                    <View style={styles.loadingContent}>
                        <SkeletonLoader width="80%" height={60} borderRadius={8} style={{ marginBottom: 20 }} />
                        <SkeletonButton />
                        <SkeletonButton />
                    </View>
                </View>
            </Layout>
        );
    }

    return (
        <Layout>
            {showConfetti && <Confetti />}

            {/* Achievement Unlock Modal */}
            {showAchievementModal && newAchievement && (
                <View style={styles.achievementModalOverlay}>
                    <Animated.View
                        style={[
                            styles.achievementModal,
                            {
                                transform: [
                                    { scale: achievementScale },
                                    {
                                        rotate: achievementRotation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '360deg'],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <View style={styles.achievementIconContainer}>
                            <Text style={styles.achievementIcon}>{newAchievement.icon}</Text>
                            <View style={styles.achievementSparkles}>
                                <Text style={styles.sparkle}>✨</Text>
                            </View>
                        </View>
                        <Text style={styles.achievementTitle}>Yeni Başarım!</Text>
                        <Text style={styles.achievementName}>{newAchievement.title}</Text>
                        <Text style={styles.achievementDesc}>{newAchievement.description}</Text>
                    </Animated.View>
                </View>
            )}

            <View style={styles.header}>
                <Button
                    title="<"
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    color={theme.colors.white}
                    textColor={theme.colors.primary}
                />

                {/* Progress / Streak */}
                <View style={styles.streakContainer}>
                    {[...Array(3)].map((_, i) => (
                        <Star
                            key={i}
                            size={24}
                            color={i < streak % 4 ? "#FFD700" : "rgba(255,255,255,0.5)"}
                            fill={i < streak % 4 ? "#FFD700" : "transparent"}
                        />
                    ))}
                </View>

                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreLabel}>Puan</Text>
                    <Text style={styles.scoreValue}>{score}</Text>
                </View>
            </View>

            {/* Progress Bar - Seviye modunda göster */}
            {levelId && (
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${(questionsAnswered / 10) * 100}%`,
                                },
                            ]}
                        >
                            <LinearGradient
                                colors={[theme.colors.success, theme.colors.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={StyleSheet.absoluteFill}
                            />
                        </Animated.View>
                    </View>
                    <Text style={styles.progressText}>
                        {questionsAnswered}/10 Soru
                    </Text>
                </View>
            )}

            <View style={styles.gameArea}>
                {/* Mascot Peeking - Tap to change */}
                <TouchableOpacity onPress={changeCharacter} activeOpacity={0.8} style={styles.mascotContainer}>
                    <Mascot
                        type={character}
                        emotion={isChecking ? (streak > 0 ? 'happy' : 'sad') : 'happy'}
                    />
                    {unlockedCharacters.length < CHARACTERS.length && (
                        <View style={styles.lockHint}>
                            <Lock size={12} color="rgba(0,0,0,0.3)" />
                            <Text style={styles.lockText}>
                                Sonraki: {UNLOCK_SCORES[CHARACTERS[unlockedCharacters.length]]}p
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Question Card */}
                <Animated.View style={[styles.questionCard, { transform: [{ translateX: questionShake }] }]}>
                    <Text style={styles.questionText}>{currentQuestion.question}</Text>
                </Animated.View>

                {/* Feedback Overlay */}
                <Animated.View style={[styles.feedbackContainer, { transform: [{ scale: feedbackScale }], opacity: feedbackOpacity }]}>
                    <Text style={styles.feedbackText}>{feedbackMessage}</Text>
                </Animated.View>

                <View style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => (
                        <View
                            key={`${currentQuestion.question}-${index}`}
                            style={styles.optionWrapper}
                        >
                            <Button
                                title={option.toString()}
                                onPress={() => handleAnswer(option)}
                                color={theme.colors.white}
                                textColor={theme.colors.text}
                                style={styles.optionButton}
                            />
                        </View>
                    ))}
                </View>
            </View>

            {/* Game Over Modal */}
            {gameOver && (
                <View style={styles.gameOverOverlay}>
                    <View style={styles.gameOverCard}>
                        <Text style={styles.gameOverTitle}>
                            {earnedStars > 0 ? 'Tebrikler!' : 'Tekrar Dene'}
                        </Text>
                        <View style={styles.starsResult}>
                            {[1, 2, 3].map(i => (
                                <Star
                                    key={i}
                                    size={48}
                                    fill={i <= earnedStars ? theme.colors.gold : theme.colors.white}
                                    color={theme.colors.gold}
                                />
                            ))}
                        </View>
                        <Text style={styles.resultText}>
                            {correctCount} / 10 Doğru
                        </Text>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: theme.colors.accent }]}
                                onPress={() => navigation.goBack()}
                            >
                                <Home color={theme.colors.white} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: theme.colors.green }]}
                                onPress={() => {
                                    setQuestionsAnswered(0);
                                    setCorrectCount(0);
                                    setGameOver(false);
                                    loadNewQuestion();
                                }}
                            >
                                <RotateCcw color={theme.colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </Layout>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.l,
        zIndex: 10,
    },
    backButton: {
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.s,
        borderRadius: theme.borderRadius.m,
        height: 40,
    },
    streakContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    scoreContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: theme.spacing.l,
        paddingVertical: theme.spacing.s,
        borderRadius: theme.borderRadius.l,
        elevation: 2,
    },
    scoreLabel: {
        fontSize: 12,
        color: theme.colors.text,
        opacity: 0.6,
    },
    scoreValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    gameArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mascotContainer: {
        marginBottom: -20,
        zIndex: 1,
        alignItems: 'center',
    },
    lockHint: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginTop: -10,
    },
    lockText: {
        fontSize: 10,
        color: 'rgba(0,0,0,0.5)',
        marginLeft: 4,
    },
    questionCard: {
        marginBottom: theme.spacing.xl,
        padding: theme.spacing.xl,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: theme.borderRadius.xl,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 2,
    },
    questionText: {
        fontSize: 56,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    feedbackContainer: {
        position: 'absolute',
        top: '30%',
        zIndex: 20,
        backgroundColor: theme.colors.success,
        paddingVertical: theme.spacing.m,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.l,
        elevation: 10,
        transform: [{ rotate: '-5deg' }],
    },
    feedbackText: {
        color: theme.colors.white,
        fontSize: 32,
        fontWeight: 'bold',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: theme.spacing.m,
        width: '100%',
        marginTop: theme.spacing.m,
    },
    optionWrapper: {
        width: '45%',
    },
    optionButton: {
        width: '100%',
        paddingVertical: theme.spacing.l,
    },
    gameOverOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    gameOverCard: {
        backgroundColor: theme.colors.white,
        padding: theme.spacing.xl,
        borderRadius: 30,
        alignItems: 'center',
        width: '80%',
    },
    gameOverTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.m,
    },
    starsResult: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: theme.spacing.m,
    },
    resultText: {
        fontSize: 20,
        color: theme.colors.text,
        marginBottom: theme.spacing.xl,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: theme.spacing.m,
    },
    actionBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    progressBarContainer: {
        paddingHorizontal: theme.spacing.l,
        paddingVertical: theme.spacing.s,
        backgroundColor: 'rgba(255,255,255,0.9)',
        marginHorizontal: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.s,
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: theme.colors.textLight,
        textAlign: 'center',
        fontWeight: '600',
    },
    achievementModalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 200,
    },
    achievementModal: {
        backgroundColor: theme.colors.white,
        borderRadius: 30,
        padding: theme.spacing.xl,
        alignItems: 'center',
        width: '85%',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    achievementIconContainer: {
        position: 'relative',
        marginBottom: theme.spacing.m,
    },
    achievementIcon: {
        fontSize: 80,
    },
    achievementSparkles: {
        position: 'absolute',
        top: -10,
        right: -10,
    },
    sparkle: {
        fontSize: 30,
    },
    achievementTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.gold,
        marginBottom: theme.spacing.s,
    },
    achievementName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.s,
        textAlign: 'center',
    },
    achievementDesc: {
        fontSize: 14,
        color: theme.colors.textLight,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        padding: theme.spacing.l,
    },
    loadingContent: {
        marginTop: theme.spacing.xl,
        gap: theme.spacing.m,
    },
});

export default GameScreen;
