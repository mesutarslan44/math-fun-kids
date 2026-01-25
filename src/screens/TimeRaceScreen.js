import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Timer, Zap } from 'lucide-react-native';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Confetti from '../components/Confetti';
import theme from '../constants/theme';
import { generateQuestion } from '../utils/gameLogic';
import { getDifficulty } from '../utils/DifficultyManager';
import { playSuccess, playFailure, playSelection } from '../utils/SoundManager';
import { recordAnswer, recordSession } from '../utils/StatsManager';
import { addToLeaderboard } from '../utils/LeaderboardManager';

const TimeRaceScreen = ({ navigation }) => {
    const [difficulty, setDifficulty] = useState('easy');
    const [gameState, setGameState] = useState('ready'); // ready, playing, finished
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showNamePrompt, setShowNamePrompt] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [currentMode, setCurrentMode] = useState('addition');

    const timerRef = useRef(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        loadDifficulty();
        // Record session when game starts (will be called when startGame is called)
        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if (timeLeft <= 10 && gameState === 'playing') {
            // Pulse animation when time is running out
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 300, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();
        }
    }, [timeLeft]);

    const loadDifficulty = async () => {
        const diff = await getDifficulty();
        setDifficulty(diff);
    };

    const startGame = () => {
        setGameState('playing');
        // Record session when game starts
        recordSession();
        setScore(0);
        setTimeLeft(60);
        loadNewQuestion();

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setGameState('finished');
                    setShowConfetti(true);
                    setShowNamePrompt(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const loadNewQuestion = async () => {
        const diff = await getDifficulty();
        // Randomly select a mode for each question
        const modes = ['addition', 'subtraction', 'multiplication', 'division'];
        const randomMode = modes[Math.floor(Math.random() * modes.length)];
        setCurrentMode(randomMode);
        const q = generateQuestion(randomMode, diff);
        setCurrentQuestion(q);
    };

    const handleAnswer = async (answer) => {
        if (gameState !== 'playing') return;

        playSelection();
        const isCorrect = answer === currentQuestion.answer;

        if (isCorrect) {
            setScore(s => s + 10);
            playSuccess();
            await recordAnswer(currentMode, true);
        } else {
            playFailure();
            await recordAnswer(currentMode, false);
        }

        loadNewQuestion();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const saveToLeaderboard = async () => {
        if (playerName.trim()) {
            await addToLeaderboard(playerName.trim(), score);
            setShowNamePrompt(false);
            playSuccess();
        }
    };

    return (
        <Layout>
            {showConfetti && <Confetti />}

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>←</Text>
                </TouchableOpacity>
                <View style={styles.titleRow}>
                    <Zap color={theme.colors.orange} size={28} />
                    <Text style={styles.title}>Zaman Yarışı</Text>
                </View>
                <View style={styles.placeholder} />
            </View>

            {gameState === 'ready' && (
                <View style={styles.readyContainer}>
                    <Timer color={theme.colors.accent} size={80} />
                    <Text style={styles.readyTitle}>60 Saniye!</Text>
                    <Text style={styles.readyText}>
                        Süre dolmadan en çok puanı topla!
                    </Text>
                    <Button
                        title="Başla!"
                        onPress={startGame}
                        color={theme.colors.success}
                        textColor={theme.colors.white}
                        style={{ marginTop: 30, paddingHorizontal: 50 }}
                    />
                </View>
            )}

            {gameState === 'playing' && currentQuestion && (
                <View style={styles.gameContainer}>
                    <Animated.View style={[styles.timerBox, { transform: [{ scale: pulseAnim }] }]}>
                        <Text style={[styles.timerText, timeLeft <= 10 && styles.timerDanger]}>
                            {formatTime(timeLeft)}
                        </Text>
                    </Animated.View>

                    <Text style={styles.scoreText}>Puan: {score}</Text>

                    <View style={styles.questionCard}>
                        <Text style={styles.questionText}>{currentQuestion.question}</Text>
                    </View>

                    <View style={styles.optionsRow}>
                        {currentQuestion.options.map((opt, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.optionBtn}
                                onPress={() => handleAnswer(opt)}
                            >
                                <Text style={styles.optionText}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {gameState === 'finished' && (
                <View style={styles.finishedContainer}>
                    <Text style={styles.finishedTitle}>Süre Doldu!</Text>
                    <Text style={styles.finalScore}>{score}</Text>
                    <Text style={styles.finalLabel}>Puan</Text>

                    {showNamePrompt && (
                        <View style={styles.namePrompt}>
                            <Text style={styles.promptText}>Adını gir:</Text>
                            <TextInput
                                style={styles.nameInput}
                                value={playerName}
                                onChangeText={setPlayerName}
                                placeholder="İsim"
                                maxLength={15}
                            />
                            <Button
                                title="Kaydet"
                                onPress={saveToLeaderboard}
                                color={theme.colors.success}
                                textColor={theme.colors.white}
                            />
                        </View>
                    )}

                    <View style={styles.actionRow}>
                        <Button
                            title="Tekrar"
                            onPress={startGame}
                            color={theme.colors.success}
                            textColor={theme.colors.white}
                        />
                        <Button
                            title="Ana Menü"
                            onPress={() => navigation.goBack()}
                            color={theme.colors.accent}
                            textColor={theme.colors.white}
                        />
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
        marginBottom: 20,
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
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    placeholder: {
        width: 40,
    },
    readyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    readyTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginTop: 20,
    },
    readyText: {
        fontSize: 18,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginTop: 10,
    },
    gameContainer: {
        flex: 1,
        alignItems: 'center',
    },
    timerBox: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 20,
        marginBottom: 10,
    },
    timerText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    timerDanger: {
        color: theme.colors.secondary,
    },
    scoreText: {
        fontSize: 20,
        color: theme.colors.text,
        marginBottom: 20,
    },
    questionCard: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: 40,
        borderRadius: 25,
        marginBottom: 30,
        elevation: 5,
    },
    questionText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    optionsRow: {
        flexDirection: 'row',
        gap: 15,
    },
    optionBtn: {
        backgroundColor: theme.colors.white,
        paddingVertical: 20,
        paddingHorizontal: 35,
        borderRadius: 15,
        elevation: 3,
    },
    optionText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    finishedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    finishedTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    finalScore: {
        fontSize: 72,
        fontWeight: 'bold',
        color: theme.colors.gold,
        marginTop: 10,
    },
    finalLabel: {
        fontSize: 24,
        color: theme.colors.textLight,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 20,
    },
    namePrompt: {
        marginTop: 20,
        alignItems: 'center',
        gap: 10,
    },
    promptText: {
        fontSize: 16,
        color: theme.colors.text,
    },
    nameInput: {
        backgroundColor: theme.colors.white,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        fontSize: 18,
        minWidth: 200,
        textAlign: 'center',
    },
});

export default TimeRaceScreen;
