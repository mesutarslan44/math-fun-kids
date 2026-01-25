import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Brain, Lightbulb, Home, RotateCcw, Star, ChevronRight } from 'lucide-react-native';
import Layout from '../components/Layout';
import Confetti from '../components/Confetti';
import theme from '../constants/theme';
import { getBilsemLevelById } from '../data/bilsemQuestions';
import { saveBilsemLevelProgress } from '../utils/BilsemManager';
import { playSuccess, playFailure, playSelection } from '../utils/SoundManager';
import { recordAnswer, recordSession } from '../utils/StatsManager';

const BilsemGameScreen = ({ navigation, route }) => {
    const { levelId } = route.params;
    const [level, setLevel] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [gameState, setGameState] = useState('playing'); // playing, finished
    const [showConfetti, setShowConfetti] = useState(false);
    const [finalResult, setFinalResult] = useState(null);

    const shakeAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const levelData = getBilsemLevelById(levelId);
        if (levelData) {
            // Shuffle questions for variety
            const shuffledQuestions = [...levelData.questions].sort(() => Math.random() - 0.5);
            setLevel({ ...levelData, questions: shuffledQuestions });
        }

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Record session when game starts
        recordSession();
    }, [levelId]);

    const currentQuestion = level?.questions[currentQuestionIndex];

    const handleAnswer = async (answer) => {
        if (isAnswered) return;

        playSelection();
        setSelectedAnswer(answer);
        setIsAnswered(true);

        const isCorrect = answer === currentQuestion.answer;

        // Record answer for stats (use 'addition' as mode for BİLSEM)
        await recordAnswer('addition', isCorrect);

        if (isCorrect) {
            setScore(s => s + 1);
            playSuccess();
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1500);
        } else {
            playFailure();
            shakeQuestion();
        }

        // Wait and move to next question
        setTimeout(() => {
            if (currentQuestionIndex < level.questions.length - 1) {
                setCurrentQuestionIndex(i => i + 1);
                setSelectedAnswer(null);
                setIsAnswered(false);
                setShowHint(false);
            } else {
                finishGame();
            }
        }, 2000);
    };

    const shakeQuestion = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const finishGame = async () => {
        const result = await saveBilsemLevelProgress(levelId, score, level.questions.length);
        setFinalResult(result);
        setGameState('finished');

        if (result.passed) {
            setShowConfetti(true);
            playSuccess();
        }
    };

    const restartLevel = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowHint(false);
        setGameState('playing');
        setFinalResult(null);
        setShowConfetti(false);

        // Reshuffle questions
        if (level) {
            const shuffled = [...level.questions].sort(() => Math.random() - 0.5);
            setLevel({ ...level, questions: shuffled });
        }
    };

    if (!level || !currentQuestion) {
        return (
            <Layout>
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </Layout>
        );
    }

    // Finished State
    if (gameState === 'finished') {
        const percentage = Math.round((score / level.questions.length) * 100);
        const passed = percentage >= 70;

        return (
            <Layout>
                {showConfetti && <Confetti />}

                <View style={styles.finishedContainer}>
                    <Brain color={passed ? theme.colors.success : theme.colors.secondary} size={80} />

                    <Text style={styles.finishedTitle}>
                        {passed ? 'Tebrikler! 🎉' : 'Tekrar Dene! 💪'}
                    </Text>

                    <View style={styles.scoreCard}>
                        <Text style={styles.scoreLabel}>Puanın</Text>
                        <Text style={[styles.scoreValue, { color: passed ? theme.colors.success : theme.colors.secondary }]}>
                            %{percentage}
                        </Text>
                        <Text style={styles.scoreDetail}>{score} / {level.questions.length} Doğru</Text>
                    </View>

                    {passed ? (
                        <View style={styles.passedMessage}>
                            <Star color={theme.colors.gold} size={24} fill={theme.colors.gold} />
                            <Text style={styles.passedText}>
                                {levelId < 10 ? 'Sonraki seviye açıldı!' : 'Tüm seviyeleri tamamladın!'}
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.failedText}>
                            Geçmek için en az %70 gerekli
                        </Text>
                    )}

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: theme.colors.accent }]}
                            onPress={() => navigation.goBack()}
                        >
                            <Home color={theme.colors.white} size={24} />
                            <Text style={styles.actionBtnText}>Seviyeler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: theme.colors.success }]}
                            onPress={restartLevel}
                        >
                            <RotateCcw color={theme.colors.white} size={24} />
                            <Text style={styles.actionBtnText}>Tekrar</Text>
                        </TouchableOpacity>

                        {passed && levelId < 10 && (
                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: theme.colors.purple }]}
                                onPress={() => navigation.replace('BilsemGame', { levelId: levelId + 1 })}
                            >
                                <ChevronRight color={theme.colors.white} size={24} />
                                <Text style={styles.actionBtnText}>Sonraki</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Layout>
        );
    }

    // Playing State
    return (
        <Layout>
            {showConfetti && <Confetti />}

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backBtnText}>←</Text>
                </TouchableOpacity>

                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {currentQuestionIndex + 1} / {level.questions.length}
                    </Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${((currentQuestionIndex + 1) / level.questions.length) * 100}%` }
                            ]}
                        />
                    </View>
                </View>

                <View style={styles.scoreBox}>
                    <Star color={theme.colors.gold} size={18} fill={theme.colors.gold} />
                    <Text style={styles.scoreBoxText}>{score}</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.gameContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Level Title */}
                <View style={styles.levelBadge}>
                    <Brain color={theme.colors.purple} size={18} />
                    <Text style={styles.levelBadgeText}>Seviye {level.id}: {level.title}</Text>
                </View>

                {/* Question Card */}
                <Animated.View
                    style={[
                        styles.questionCard,
                        {
                            transform: [{ translateX: shakeAnim }],
                            opacity: fadeAnim,
                        }
                    ]}
                >
                    <Text style={styles.questionType}>
                        {currentQuestion.type === 'pattern' && '📊 Örüntü'}
                        {currentQuestion.type === 'analogy' && '🔗 Analoji'}
                        {currentQuestion.type === 'logic' && '🧩 Mantık'}
                        {currentQuestion.type === 'visual' && '👁️ Görsel'}
                        {currentQuestion.type === 'sequence' && '🔢 Dizi'}
                    </Text>

                    <Text style={styles.questionText}>{currentQuestion.question}</Text>

                    {/* Hint Button */}
                    {!showHint && !isAnswered && (
                        <TouchableOpacity
                            style={styles.hintBtn}
                            onPress={() => setShowHint(true)}
                        >
                            <Lightbulb color={theme.colors.gold} size={18} />
                            <Text style={styles.hintBtnText}>İpucu</Text>
                        </TouchableOpacity>
                    )}

                    {showHint && (
                        <View style={styles.hintBox}>
                            <Lightbulb color={theme.colors.gold} size={16} />
                            <Text style={styles.hintText}>{currentQuestion.hint}</Text>
                        </View>
                    )}
                </Animated.View>

                {/* Options */}
                <View style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrectAnswer = option === currentQuestion.answer;
                        const showAsCorrect = isAnswered && isCorrectAnswer;
                        const showAsWrong = isAnswered && isSelected && !isCorrectAnswer;

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionBtn,
                                    showAsCorrect && styles.correctOption,
                                    showAsWrong && styles.wrongOption,
                                ]}
                                onPress={() => handleAnswer(option)}
                                disabled={isAnswered}
                            >
                                <Text style={[
                                    styles.optionText,
                                    (showAsCorrect || showAsWrong) && styles.optionTextSelected,
                                ]}>
                                    {option}
                                </Text>
                                {showAsCorrect && <Text style={styles.correctMark}>✓</Text>}
                                {showAsWrong && <Text style={styles.wrongMark}>✗</Text>}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    loadingText: {
        fontSize: 18,
        color: theme.colors.text,
        textAlign: 'center',
        marginTop: 50,
    },
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
    backBtnText: {
        fontSize: 24,
        color: theme.colors.text,
    },
    progressContainer: {
        flex: 1,
        marginHorizontal: 15,
    },
    progressText: {
        fontSize: 12,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 4,
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.purple,
        borderRadius: 4,
    },
    scoreBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
    },
    scoreBoxText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    gameContent: {
        paddingBottom: 30,
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 15,
    },
    levelBadgeText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.purple,
    },
    questionCard: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        elevation: 4,
    },
    questionType: {
        fontSize: 14,
        color: theme.colors.textLight,
        marginBottom: 10,
    },
    questionText: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.colors.text,
        lineHeight: 30,
    },
    hintBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 15,
        paddingVertical: 10,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.gold,
    },
    hintBtnText: {
        fontSize: 14,
        color: theme.colors.gold,
        fontWeight: '600',
    },
    hintBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginTop: 15,
        padding: 12,
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        borderRadius: 12,
    },
    hintText: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.text,
        fontStyle: 'italic',
    },
    optionsContainer: {
        gap: 12,
    },
    optionBtn: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    correctOption: {
        backgroundColor: theme.colors.success,
        borderColor: theme.colors.success,
    },
    wrongOption: {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.secondary,
    },
    optionText: {
        fontSize: 16,
        color: theme.colors.text,
        flex: 1,
    },
    optionTextSelected: {
        color: theme.colors.white,
        fontWeight: 'bold',
    },
    correctMark: {
        fontSize: 20,
        color: theme.colors.white,
        fontWeight: 'bold',
    },
    wrongMark: {
        fontSize: 20,
        color: theme.colors.white,
        fontWeight: 'bold',
    },
    // Finished styles
    finishedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    finishedTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 20,
        marginBottom: 20,
    },
    scoreCard: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 4,
        minWidth: 200,
    },
    scoreLabel: {
        fontSize: 16,
        color: theme.colors.textLight,
    },
    scoreValue: {
        fontSize: 56,
        fontWeight: 'bold',
    },
    scoreDetail: {
        fontSize: 16,
        color: theme.colors.text,
        marginTop: 5,
    },
    passedMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    passedText: {
        fontSize: 16,
        color: theme.colors.success,
        fontWeight: '600',
    },
    failedText: {
        fontSize: 16,
        color: theme.colors.textLight,
        marginBottom: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 15,
    },
    actionBtn: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 3,
    },
    actionBtnText: {
        color: theme.colors.white,
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 5,
    },
});

export default BilsemGameScreen;
