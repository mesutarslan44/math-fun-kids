import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Home, RotateCcw, Star, ChevronRight, Clock, Lightbulb } from 'lucide-react-native';
import Layout from '../components/Layout';
import Confetti from '../components/Confetti';
import theme from '../constants/theme';
import { getShadowLevelById, generateShadowQuestion } from '../data/shadowGameData';
import { saveShadowLevelProgress } from '../utils/ShadowManager';
import { playSuccess, playFailure, playSelection } from '../utils/SoundManager';

const { width } = Dimensions.get('window');

const ShadowGameScreen = ({ navigation, route }) => {
    const { levelId } = route.params;
    const [level, setLevel] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [gameState, setGameState] = useState('playing');
    const [showConfetti, setShowConfetti] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);

    const shakeAnim = useRef(new Animated.Value(0)).current;
    const timerRef = useRef(null);

    useEffect(() => {
        initGame();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [levelId]);

    const initGame = () => {
        const levelData = getShadowLevelById(levelId);
        if (levelData) {
            setLevel(levelData);
            setCurrentIndex(0);
            setScore(0);
            setGameState('playing');
            setShowConfetti(false);
            loadNewQuestion(levelData);
        }
    };

    const loadNewQuestion = (lvl) => {
        const q = generateShadowQuestion(lvl);
        setQuestion(q);
        setSelectedOption(null);
        setIsAnswered(false);
        setShowHint(false);

        // Start timer if level has time limit
        if (lvl.timeLimit) {
            setTimeLeft(lvl.timeLimit);
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 100) {
                        clearInterval(timerRef.current);
                        handleTimeout();
                        return 0;
                    }
                    return prev - 100;
                });
            }, 100);
        }
    };

    const handleTimeout = () => {
        if (!isAnswered) {
            setIsAnswered(true);
            playFailure();
            shakeQuestion();

            setTimeout(() => {
                moveToNext();
            }, 1500);
        }
    };

    const handleOptionSelect = (index) => {
        if (isAnswered) return;

        if (timerRef.current) clearInterval(timerRef.current);

        playSelection();
        setSelectedOption(index);
        setIsAnswered(true);

        const isCorrect = index === question.correctIndex;

        if (isCorrect) {
            setScore(s => s + 1);
            playSuccess();
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1500);
        } else {
            playFailure();
            shakeQuestion();
        }

        setTimeout(() => {
            moveToNext();
        }, 1500);
    };

    const moveToNext = () => {
        if (currentIndex < level.questionsCount - 1) {
            setCurrentIndex(i => i + 1);
            loadNewQuestion(level);
        } else {
            finishGame();
        }
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
        if (timerRef.current) clearInterval(timerRef.current);
        const result = await saveShadowLevelProgress(levelId, score, level.questionsCount);
        setGameState('finished');

        if (result.passed) {
            setShowConfetti(true);
            playSuccess();
        }
    };

    // Grid pattern render
    const renderGridPattern = (pattern, isShadow = false, size = 60) => {
        const cellSize = size / pattern.length;

        return (
            <View style={[styles.gridContainer, { width: size, height: size }]}>
                {pattern.map((row, rowIdx) => (
                    <View key={rowIdx} style={styles.gridRow}>
                        {row.map((cell, colIdx) => (
                            <View
                                key={colIdx}
                                style={[
                                    styles.gridCell,
                                    {
                                        width: cellSize - 2,
                                        height: cellSize - 2,
                                        backgroundColor: cell === 1
                                            ? (isShadow ? '#1a1a2e' : '#2C3E50')
                                            : 'rgba(200,200,200,0.3)',
                                    }
                                ]}
                            />
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    if (!level || !question) {
        return (
            <Layout>
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </Layout>
        );
    }

    // Finished State
    if (gameState === 'finished') {
        const percentage = Math.round((score / level.questionsCount) * 100);
        const passed = percentage >= 70;

        return (
            <Layout>
                {showConfetti && <Confetti />}

                <View style={styles.finishedContainer}>
                    <Text style={styles.finishedIcon}>👤</Text>

                    <Text style={styles.finishedTitle}>
                        {passed ? 'Gölge Bulundu! 🎉' : 'Tekrar Dene! 💪'}
                    </Text>

                    <View style={styles.scoreCard}>
                        <Text style={styles.scoreLabel}>Puanın</Text>
                        <Text style={[styles.scoreValue, { color: passed ? theme.colors.success : theme.colors.secondary }]}>
                            %{percentage}
                        </Text>
                        <Text style={styles.scoreDetail}>{score} / {level.questionsCount} Doğru</Text>
                    </View>

                    <Text style={passed ? styles.passedText : styles.failedText}>
                        {passed
                            ? (levelId < 10 ? 'Sonraki seviye açıldı!' : 'Tüm gölgeleri buldun!')
                            : 'Geçmek için en az %70 gerekli'
                        }
                    </Text>

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
                            onPress={initGame}
                        >
                            <RotateCcw color={theme.colors.white} size={24} />
                            <Text style={styles.actionBtnText}>Tekrar</Text>
                        </TouchableOpacity>

                        {passed && levelId < 10 && (
                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: '#2C3E50' }]}
                                onPress={() => navigation.replace('ShadowGame', { levelId: levelId + 1 })}
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
                        {currentIndex + 1} / {level.questionsCount}
                    </Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${((currentIndex + 1) / level.questionsCount) * 100}%` }
                            ]}
                        />
                    </View>
                </View>

                <View style={styles.scoreBox}>
                    <Star color={theme.colors.gold} size={18} fill={theme.colors.gold} />
                    <Text style={styles.scoreBoxText}>{score}</Text>
                </View>
            </View>

            {/* Timer */}
            {timeLeft !== null && (
                <View style={styles.timerBox}>
                    <Clock color={timeLeft < 3000 ? theme.colors.secondary : theme.colors.text} size={18} />
                    <Text style={[styles.timerText, timeLeft < 3000 && { color: theme.colors.secondary }]}>
                        {(timeLeft / 1000).toFixed(1)}s
                    </Text>
                </View>
            )}

            {/* Question Card */}
            <Animated.View
                style={[
                    styles.questionCard,
                    { transform: [{ translateX: shakeAnim }] }
                ]}
            >
                <Text style={styles.questionLabel}>Bu gölgenin sahibini bul!</Text>

                {/* Shadow Display - Large dark area with silhouette */}
                <View style={styles.shadowBox}>
                    <View style={styles.shadowArea}>
                        {question.type === 'emoji' ? (
                            <View style={[
                                styles.shadowEmojiContainer,
                                {
                                    // Rastgele konum için offset
                                    marginTop: Math.random() * 20 - 10,
                                    marginLeft: Math.random() * 30 - 15,
                                }
                            ]}>
                                <Text style={styles.shadowEmoji}>{question.target}</Text>
                            </View>
                        ) : (
                            renderGridPattern(question.target, true, 100)
                        )}
                    </View>
                </View>

                {/* Hint */}
                {!showHint && !isAnswered && question.hint && (
                    <TouchableOpacity
                        style={styles.hintBtn}
                        onPress={() => setShowHint(true)}
                    >
                        <Lightbulb color={theme.colors.gold} size={16} />
                        <Text style={styles.hintBtnText}>İpucu</Text>
                    </TouchableOpacity>
                )}

                {showHint && (
                    <View style={styles.hintBox}>
                        <Lightbulb color={theme.colors.gold} size={14} />
                        <Text style={styles.hintText}>{question.hint}</Text>
                    </View>
                )}
            </Animated.View>

            {/* Options */}
            <View style={styles.optionsContainer}>
                {question.options.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const isCorrect = index === question.correctIndex;
                    const showAsCorrect = isAnswered && isCorrect;
                    const showAsWrong = isAnswered && isSelected && !isCorrect;

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.optionBtn,
                                showAsCorrect && styles.correctOption,
                                showAsWrong && styles.wrongOption,
                            ]}
                            onPress={() => handleOptionSelect(index)}
                            disabled={isAnswered}
                        >
                            {question.type === 'emoji' ? (
                                <Text style={styles.optionEmoji}>{option}</Text>
                            ) : (
                                renderGridPattern(option, false, 50)
                            )}
                            {showAsCorrect && <Text style={styles.checkMark}>✓</Text>}
                            {showAsWrong && <Text style={styles.wrongMark}>✗</Text>}
                        </TouchableOpacity>
                    );
                })}
            </View>
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
        backgroundColor: '#2C3E50',
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
    timerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 10,
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    questionCard: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        elevation: 4,
    },
    questionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 15,
    },
    shadowBox: {
        backgroundColor: '#0a0a15',
        padding: 10,
        borderRadius: 24,
        marginBottom: 15,
        minWidth: 200,
        minHeight: 150,
        alignItems: 'center',
        justifyContent: 'center',
        // Dış gölge efekti
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    shadowArea: {
        width: 160,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0d0d1a',
        borderRadius: 16,
    },
    shadowEmojiContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    shadowEmoji: {
        fontSize: 70,
        opacity: 0.15, // Gerçek silüet efekti - çok düşük opacity
        color: '#ffffff',
    },
    gridContainer: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    gridRow: {
        flexDirection: 'row',
    },
    gridCell: {
        margin: 1,
        borderRadius: 2,
    },
    hintBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 15,
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
        alignItems: 'center',
        gap: 8,
        padding: 12,
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        borderRadius: 12,
    },
    hintText: {
        fontSize: 14,
        color: theme.colors.text,
        fontStyle: 'italic',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        marginTop: 20,
    },
    optionBtn: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 18,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        borderWidth: 3,
        borderColor: 'transparent',
        minWidth: 80,
        minHeight: 80,
    },
    optionEmoji: {
        fontSize: 40,
    },
    correctOption: {
        borderColor: theme.colors.success,
        backgroundColor: 'rgba(107, 203, 119, 0.2)',
    },
    wrongOption: {
        borderColor: theme.colors.secondary,
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
    },
    checkMark: {
        position: 'absolute',
        top: 5,
        right: 5,
        fontSize: 18,
        color: theme.colors.success,
        fontWeight: 'bold',
    },
    wrongMark: {
        position: 'absolute',
        top: 5,
        right: 5,
        fontSize: 18,
        color: theme.colors.secondary,
        fontWeight: 'bold',
    },
    // Finished styles
    finishedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    finishedIcon: {
        fontSize: 80,
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
    passedText: {
        fontSize: 16,
        color: theme.colors.success,
        fontWeight: '600',
        marginBottom: 20,
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

export default ShadowGameScreen;
