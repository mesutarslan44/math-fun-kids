import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Home, RotateCcw, Star, ChevronRight, Clock } from 'lucide-react-native';
import Layout from '../components/Layout';
import Confetti from '../components/Confetti';
import theme from '../constants/theme';
import { getSymmetryLevelById, generateSymmetryQuestion } from '../data/symmetryGameData';
import { saveSymmetryLevelProgress } from '../utils/SymmetryManager';
import { playSuccess, playFailure, playSelection } from '../utils/SoundManager';

const { width } = Dimensions.get('window');

const SymmetryGameScreen = ({ navigation, route }) => {
    const { levelId } = route.params;
    const [level, setLevel] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [gameState, setGameState] = useState('playing');
    const [showConfetti, setShowConfetti] = useState(false);
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
        const levelData = getSymmetryLevelById(levelId);
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
        const q = generateSymmetryQuestion(lvl);
        setQuestion(q);
        setSelectedOption(null);
        setIsAnswered(false);

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
        const result = await saveSymmetryLevelProgress(levelId, score, level.questionsCount);
        setGameState('finished');

        if (result.passed) {
            setShowConfetti(true);
            playSuccess();
        }
    };

    // Grid Render
    const renderGrid = (pattern, size, isSmall = false) => {
        const gridSize = isSmall ? Math.min(60, (width - 80) / 5) : Math.min(120, (width - 60) / 2);
        const cellSize = gridSize / pattern.length;

        return (
            <View style={[styles.grid, { width: gridSize, height: gridSize }]}>
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
                                        backgroundColor: cell === 1 ? '#9B59B6' : 'rgba(200,200,200,0.3)',
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
                    <Text style={styles.finishedIcon}>🪞</Text>

                    <Text style={styles.finishedTitle}>
                        {passed ? 'Tebrikler! 🎉' : 'Tekrar Dene! 💪'}
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
                            ? (levelId < 10 ? 'Sonraki seviye açıldı!' : 'Tüm seviyeleri tamamladın!')
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
                                style={[styles.actionBtn, { backgroundColor: '#9B59B6' }]}
                                onPress={() => navigation.replace('SymmetryGame', { levelId: levelId + 1 })}
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

            {/* Question */}
            <Animated.View
                style={[
                    styles.questionCard,
                    { transform: [{ translateX: shakeAnim }] }
                ]}
            >
                <Text style={styles.mirrorLabel}>{question.mirrorLabel}</Text>
                <Text style={styles.questionText}>Bu şeklin ayna görüntüsü hangisi?</Text>

                {/* Original Pattern */}
                <View style={styles.originalSection}>
                    <Text style={styles.originalLabel}>Orijinal Şekil</Text>
                    {renderGrid(question.original)}
                </View>
            </Animated.View>

            {/* Options */}
            <View style={styles.optionsGrid}>
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
                            {renderGrid(option, level.gridSize, true)}
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
        backgroundColor: '#9B59B6',
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
    mirrorLabel: {
        fontSize: 16,
        color: '#9B59B6',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    questionText: {
        fontSize: 16,
        color: theme.colors.text,
        marginBottom: 15,
    },
    originalSection: {
        alignItems: 'center',
    },
    originalLabel: {
        fontSize: 12,
        color: theme.colors.textLight,
        marginBottom: 8,
    },
    grid: {
        borderWidth: 2,
        borderColor: '#9B59B6',
        borderRadius: 8,
    },
    gridRow: {
        flexDirection: 'row',
    },
    gridCell: {
        margin: 1,
        borderRadius: 2,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        marginTop: 20,
    },
    optionBtn: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        elevation: 3,
        borderWidth: 3,
        borderColor: 'transparent',
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

export default SymmetryGameScreen;
