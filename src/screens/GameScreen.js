import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Mascot from '../components/Mascot';
import Confetti from '../components/Confetti';
import DraggableOption from '../components/DraggableOption';
import SkeletonLoader, { SkeletonCard, SkeletonButton } from '../components/SkeletonLoader';
import theme from '../constants/theme';
import { generateQuestion } from '../utils/gameLogic';
import { playSuccess, playFailure, playSelection } from '../utils/SoundManager';
import { saveLevelProgress } from '../utils/LevelManager';
import { recordAnswer, recordSession, getStats } from '../utils/StatsManager';
import { checkAndUnlockAchievements } from '../utils/AchievementManager';
import { updateDailyGoalProgress } from '../utils/DailyGoalManager';
import Logger from '../utils/Logger';
import { Star, Lock, Home, RotateCcw, Flame } from 'lucide-react-native';

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
    const [showStreakMessage, setShowStreakMessage] = useState(false);
    const [streakMessage, setStreakMessage] = useState('');
    const achievementScale = useRef(new Animated.Value(0)).current;
    const achievementRotation = useRef(new Animated.Value(0)).current;

    // Animation values
    const feedbackScale = useRef(new Animated.Value(0)).current;
    const feedbackOpacity = useRef(new Animated.Value(0)).current;
    const questionShake = useRef(new Animated.Value(0)).current;
    const streakScale = useRef(new Animated.Value(0)).current;
    const streakOpacity = useRef(new Animated.Value(0)).current;

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

        // Check for new achievements (with current streak)
        const stats = await getStats();
        const statsWithStreak = { ...stats, currentStreak: isCorrect ? streak + 1 : 0 };
        const newAchievements = await checkAndUnlockAchievements(statsWithStreak);

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
            const newStreak = streak + 1;
            setScore(s => s + 10);
            setStreak(newStreak);
            setCorrectCount(c => c + 1);
            setShowConfetti(true);
            playSuccess();
            
            // Show streak celebration for special milestones
            if (newStreak === 3 || newStreak === 5 || newStreak === 10 || newStreak === 20) {
                showStreakCelebration(newStreak);
            }
            
            showFeedback(true, newStreak);
            saveProgress(10); // Add to persistent total score
            await updateDailyGoalProgress(1); // Update daily goal
            setQuestionsAnswered(q => q + 1);
            setTimeout(loadNewQuestion, 2000); // Longer wait to enjoy confetti
        } else {
            // Wrong!
            if (streak > 0) {
                // Show encouragement message when streak breaks
                setFeedbackMessage(`Seri ${streak} doğruydu! Tekrar başla! 💪`);
                showFeedback(false);
            } else {
                showFeedback(false);
            }
            setStreak(0);
            playFailure();
            shakeQuestion();
            setTimeout(() => {
                setIsChecking(false);
                setQuestionsAnswered(q => q + 1);
                loadNewQuestion();
            }, 1500);
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
    const getSuccessMessage = (currentStreak = 0) => {
        // Streak bazlı özel mesajlar
        if (currentStreak >= 20) {
            return 'EFSANE! 🚀🚀🚀';
        } else if (currentStreak >= 10) {
            return 'YILDIRIM HIZI! ⚡⚡';
        } else if (currentStreak >= 5) {
            return 'SERİ DEVAM! 🔥🔥';
        } else if (currentStreak >= 3) {
            return 'ATEŞ BAŞLADI! 🔥';
        }
        
        // Normal mesajlar
        const messages = [
            'Harika! 🎉',
            'Mükemmel! ⭐',
            'Süpersin! 🚀',
            'Bravo! 👏',
            'Harika iş! 💪',
            'Çok iyi! 🌟',
            'Muhteşem! 🎯',
            'Tebrikler! 🏆',
            'Süper! ✨',
            'Harika gidiyorsun! 🌈',
            'Çok başarılı! 🎊',
            'Müthiş! 💫',
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const showStreakCelebration = (streakCount) => {
        let message = '';
        if (streakCount === 3) {
            message = '3 DOĞRU ÜST ÜSTE! 🔥';
        } else if (streakCount === 5) {
            message = '5 DOĞRU ÜST ÜSTE! ⚡';
        } else if (streakCount === 10) {
            message = '10 DOĞRU ÜST ÜSTE! 🌩️';
        } else if (streakCount === 20) {
            message = '20 DOĞRU ÜST ÜSTE! 🚀';
        }
        
        setStreakMessage(message);
        setShowStreakMessage(true);
        
        // Animate streak message
        streakScale.setValue(0);
        streakOpacity.setValue(0);
        Animated.parallel([
            Animated.spring(streakScale, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(streakOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
        
        // Hide after 2 seconds
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(streakScale, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(streakOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShowStreakMessage(false);
            });
        }, 2000);
    };

    const showFeedback = (isCorrect, currentStreak = 0) => {
        if (isCorrect) {
            const message = getSuccessMessage(currentStreak);
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
            ]).start(() => {
                // Fade out after showing
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(feedbackScale, {
                            toValue: 0,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(feedbackOpacity, {
                            toValue: 0,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }, 1000);
            });
        } else {
            // Wrong answer feedback
            const wrongMessages = [
                'Tekrar dene! 💪',
                'Yaklaştın! 🎯',
                'Bir daha dene! 🌟',
                'Pes etme! 💫',
            ];
            setFeedbackMessage(wrongMessages[Math.floor(Math.random() * wrongMessages.length)]);
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
            ]).start(() => {
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(feedbackScale, {
                            toValue: 0,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(feedbackOpacity, {
                            toValue: 0,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }, 800);
            });
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
                    {streak > 0 && (
                        <View style={styles.streakBadge}>
                            <Flame size={20} color="#FF6B35" fill="#FF6B35" />
                            <Text style={styles.streakText}>{streak}</Text>
                        </View>
                    )}
                    {streak === 0 && (
                        <View style={styles.streakBadge}>
                            <Star size={20} color="rgba(255,255,255,0.5)" />
                        </View>
                    )}
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

                {/* Streak Celebration Overlay */}
                {showStreakMessage && (
                    <Animated.View 
                        style={[
                            styles.streakCelebrationContainer, 
                            { 
                                transform: [{ scale: streakScale }], 
                                opacity: streakOpacity 
                            }
                        ]}
                    >
                        <Text style={styles.streakCelebrationText}>{streakMessage}</Text>
                    </Animated.View>
                )}

                <View style={styles.optionsContainer}>
                    <Text style={styles.dragHint}>
                        👆 Seçeneği sürükleyip ortaya bırak veya dokun
                    </Text>
                    {currentQuestion.options.map((option, index) => (
                        <View
                            key={`${currentQuestion.question}-${index}`}
                            style={styles.optionWrapper}
                        >
                            <DraggableOption
                                option={option.toString()}
                                index={index}
                                onSelect={handleAnswer}
                                isSelected={false}
                                isCorrect={option === currentQuestion.answer}
                                showAsCorrect={false}
                                showAsWrong={false}
                                disabled={isChecking}
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
        alignItems: 'center',
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    streakText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    streakCelebrationContainer: {
        position: 'absolute',
        top: '25%',
        zIndex: 25,
        backgroundColor: theme.colors.orange,
        paddingVertical: theme.spacing.l,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.xl,
        elevation: 15,
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderWidth: 3,
        borderColor: theme.colors.white,
    },
    streakCelebrationText: {
        color: theme.colors.white,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
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
    dragHint: {
        width: '100%',
        fontSize: 12,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginBottom: 8,
        fontStyle: 'italic',
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
