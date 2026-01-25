import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextInput, Keyboard } from 'react-native';
import { Box, Home, RotateCcw, Star, ChevronRight, Lightbulb } from 'lucide-react-native';
import Layout from '../components/Layout';
import Confetti from '../components/Confetti';
import theme from '../constants/theme';
import { getCubeLevelById } from '../data/cubeGameData';
import { saveCubeLevelProgress } from '../utils/CubeManager';
import { playSuccess, playFailure, playSelection } from '../utils/SoundManager';
import { recordAnswer, recordSession } from '../utils/StatsManager';

const CubeGameScreen = ({ navigation, route }) => {
    const { levelId } = route.params;
    const [level, setLevel] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answer, setAnswer] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [gameState, setGameState] = useState('playing');
    const [showConfetti, setShowConfetti] = useState(false);

    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        initGame();
    }, [levelId]);

    const initGame = () => {
        const levelData = getCubeLevelById(levelId);
        if (levelData) {
            setLevel(levelData);
            const shuffled = [...levelData.questions].sort(() => Math.random() - 0.5);
            setQuestions(shuffled);
            setCurrentIndex(0);
            setScore(0);
            setAnswer('');
            setShowHint(false);
            setIsAnswered(false);
            setGameState('playing');
            setShowConfetti(false);
        }
        // Record session when game starts
        recordSession();
    };

    const currentQuestion = questions[currentIndex];

    const handleSubmit = async () => {
        if (!answer.trim() || isAnswered) return;

        Keyboard.dismiss();
        const userAnswer = parseInt(answer.trim());
        const correct = userAnswer === currentQuestion.answer;

        // Record answer for stats
        await recordAnswer('multiplication', correct);

        setIsAnswered(true);
        setIsCorrect(correct);

        if (correct) {
            setScore(s => s + 1);
            playSuccess();
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1500);
        } else {
            playFailure();
            shakeQuestion();
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(i => i + 1);
                setAnswer('');
                setShowHint(false);
                setIsAnswered(false);
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
        const result = await saveCubeLevelProgress(levelId, score, questions.length);
        setGameState('finished');

        if (result.passed) {
            setShowConfetti(true);
            playSuccess();
        }
    };

    // 3D Cube Visualization
    const renderCubeStructure = (structure) => {
        const rows = structure.length;
        const cols = structure[0].length;
        const cellSize = Math.min(45, 200 / Math.max(rows, cols));

        return (
            <View style={styles.cubeVisualization}>
                {structure.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.cubeRow}>
                        {row.map((height, colIndex) => (
                            <View
                                key={colIndex}
                                style={[
                                    styles.cubeStack,
                                    { width: cellSize, height: cellSize + (height * 8) }
                                ]}
                            >
                                {[...Array(height)].map((_, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.cube,
                                            {
                                                width: cellSize - 4,
                                                height: 18,
                                                backgroundColor: getCubeColor(height, i),
                                                bottom: i * 15,
                                                transform: [
                                                    { skewX: '-5deg' },
                                                ],
                                            }
                                        ]}
                                    >
                                        <View style={styles.cubeTop} />
                                        <View style={styles.cubeSide} />
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    const getCubeColor = (totalHeight, index) => {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
            '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
        ];
        return colors[(totalHeight + index) % colors.length];
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
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= 70;

        return (
            <Layout>
                {showConfetti && <Confetti />}

                <View style={styles.finishedContainer}>
                    <Box color={passed ? theme.colors.success : theme.colors.secondary} size={80} />

                    <Text style={styles.finishedTitle}>
                        {passed ? 'Tebrikler! 🎉' : 'Tekrar Dene! 💪'}
                    </Text>

                    <View style={styles.scoreCard}>
                        <Text style={styles.scoreLabel}>Puanın</Text>
                        <Text style={[styles.scoreValue, { color: passed ? theme.colors.success : theme.colors.secondary }]}>
                            %{percentage}
                        </Text>
                        <Text style={styles.scoreDetail}>{score} / {questions.length} Doğru</Text>
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
                                style={[styles.actionBtn, { backgroundColor: theme.colors.orange }]}
                                onPress={() => navigation.replace('CubeGame', { levelId: levelId + 1 })}
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
                        {currentIndex + 1} / {questions.length}
                    </Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${((currentIndex + 1) / questions.length) * 100}%` }
                            ]}
                        />
                    </View>
                </View>

                <View style={styles.scoreBox}>
                    <Star color={theme.colors.gold} size={18} fill={theme.colors.gold} />
                    <Text style={styles.scoreBoxText}>{score}</Text>
                </View>
            </View>

            {/* Level Badge */}
            <View style={styles.levelBadge}>
                <Box color={theme.colors.orange} size={18} />
                <Text style={styles.levelBadgeText}>Seviye {level.id}: {level.title}</Text>
            </View>

            {/* Cube Visualization */}
            <Animated.View
                style={[
                    styles.questionCard,
                    { transform: [{ translateX: shakeAnim }] }
                ]}
            >
                <Text style={styles.questionLabel}>Bu yapıda kaç küp var?</Text>

                {renderCubeStructure(currentQuestion.structure)}

                {/* Hint */}
                {!showHint && !isAnswered && (
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
                        <Text style={styles.hintText}>{currentQuestion.hint}</Text>
                    </View>
                )}
            </Animated.View>

            {/* Answer Input */}
            <View style={styles.answerSection}>
                {isAnswered ? (
                    <View style={[
                        styles.resultBox,
                        { backgroundColor: isCorrect ? theme.colors.success : theme.colors.secondary }
                    ]}>
                        <Text style={styles.resultText}>
                            {isCorrect ? '✓ Doğru!' : `✗ Yanlış! Doğru cevap: ${currentQuestion.answer}`}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.answerInput}
                            value={answer}
                            onChangeText={setAnswer}
                            keyboardType="number-pad"
                            placeholder="Cevabını yaz"
                            placeholderTextColor={theme.colors.textLight}
                            maxLength={3}
                        />
                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitBtnText}>Gönder</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        backgroundColor: theme.colors.orange,
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
        color: theme.colors.orange,
    },
    questionCard: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        elevation: 4,
        flex: 1,
    },
    questionLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 15,
    },
    cubeVisualization: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cubeRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    cubeStack: {
        position: 'relative',
        marginHorizontal: 3,
    },
    cube: {
        position: 'absolute',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        elevation: 2,
    },
    cubeTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 5,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    cubeSide: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 5,
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    hintBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 15,
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
        marginTop: 15,
        padding: 12,
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        borderRadius: 12,
    },
    hintText: {
        fontSize: 14,
        color: theme.colors.text,
        fontStyle: 'italic',
    },
    answerSection: {
        marginTop: 15,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 10,
    },
    answerInput: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        padding: 16,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme.colors.text,
    },
    submitBtn: {
        backgroundColor: theme.colors.success,
        borderRadius: 16,
        paddingHorizontal: 25,
        justifyContent: 'center',
        elevation: 3,
    },
    submitBtnText: {
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultBox: {
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.white,
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

export default CubeGameScreen;
