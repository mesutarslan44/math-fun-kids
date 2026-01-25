import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Eye, Home, RotateCcw, Star, Clock, ChevronRight } from 'lucide-react-native';
import Layout from '../components/Layout';
import Confetti from '../components/Confetti';
import theme from '../constants/theme';
import { getMemoryLevelById, generateCards } from '../data/memoryGameData';
import { saveMemoryLevelProgress } from '../utils/MemoryManager';
import { playSuccess, playFailure, playSelection } from '../utils/SoundManager';
import { recordAnswer, recordSession } from '../utils/StatsManager';

const { width } = Dimensions.get('window');

const MemoryGameScreen = ({ navigation, route }) => {
    const { levelId } = route.params;
    const [level, setLevel] = useState(null);
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameState, setGameState] = useState('preview'); // preview, playing, finished
    const [showConfetti, setShowConfetti] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [countdown, setCountdown] = useState(0);

    const timerRef = useRef(null);

    useEffect(() => {
        initGame();
        // Record session when game starts
        recordSession();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [levelId]);

    const initGame = () => {
        const levelData = getMemoryLevelById(levelId);
        if (levelData) {
            setLevel(levelData);
            const newCards = generateCards(levelData.pairs);
            setCards(newCards);
            setFlippedCards([]);
            setMatchedPairs([]);
            setMoves(0);
            setElapsedTime(0);
            setGameState('preview');
            setShowConfetti(false);

            // Countdown for preview
            const countdownTime = Math.floor(levelData.viewTime / 1000);
            setCountdown(countdownTime);

            const countdownInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        startGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    const startGame = () => {
        setGameState('playing');
        setStartTime(Date.now());

        timerRef.current = setInterval(() => {
            setElapsedTime(Date.now() - Date.now() + (Date.now() - startTime));
        }, 100);
    };

    useEffect(() => {
        if (gameState === 'playing' && startTime) {
            timerRef.current = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 100);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState, startTime]);

    const handleCardPress = (card) => {
        if (gameState !== 'playing') return;
        if (flippedCards.length >= 2) return;
        if (flippedCards.find(c => c.id === card.id)) return;
        if (matchedPairs.includes(card.pairId)) return;

        playSelection();
        const newFlipped = [...flippedCards, card];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);

            if (newFlipped[0].pairId === newFlipped[1].pairId) {
                // Match!
                playSuccess();
                // Record correct answer for stats
                recordAnswer('addition', true);
                const newMatched = [...matchedPairs, card.pairId];
                setMatchedPairs(newMatched);
                setFlippedCards([]);

                // Check if game is complete
                if (newMatched.length === level.pairs) {
                    finishGame();
                }
            } else {
                // No match
                playFailure();
                // Record wrong answer for stats
                recordAnswer('addition', false);
                setTimeout(() => {
                    setFlippedCards([]);
                }, 800);
            }
        }
    };

    const finishGame = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        const finalTime = Date.now() - startTime;
        setElapsedTime(finalTime);
        setGameState('finished');
        setShowConfetti(true);
        playSuccess();

        await saveMemoryLevelProgress(levelId, moves + 1, finalTime);
    };

    const restartLevel = () => {
        initGame();
    };

    const formatTime = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const tenths = Math.floor((ms % 1000) / 100);
        return `${seconds}.${tenths}s`;
    };

    const getCardSize = () => {
        const totalCards = cards.length;
        if (totalCards <= 6) return (width - 80) / 3;
        if (totalCards <= 12) return (width - 100) / 4;
        if (totalCards <= 20) return (width - 110) / 5;
        return (width - 120) / 6;
    };

    if (!level) {
        return (
            <Layout>
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </Layout>
        );
    }

    // Finished State
    if (gameState === 'finished') {
        return (
            <Layout>
                {showConfetti && <Confetti />}

                <View style={styles.finishedContainer}>
                    <Eye color={theme.colors.success} size={80} />

                    <Text style={styles.finishedTitle}>Tebrikler! 🎉</Text>

                    <View style={styles.scoreCard}>
                        <View style={styles.scoreRow}>
                            <Star color={theme.colors.gold} size={24} fill={theme.colors.gold} />
                            <Text style={styles.scoreLabel}>{moves} Hamle</Text>
                        </View>
                        <View style={styles.scoreRow}>
                            <Clock color={theme.colors.accent} size={24} />
                            <Text style={styles.scoreLabel}>{formatTime(elapsedTime)}</Text>
                        </View>
                    </View>

                    <Text style={styles.passedText}>
                        {levelId < 10 ? 'Sonraki seviye açıldı!' : 'Tüm seviyeleri tamamladın!'}
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
                            onPress={restartLevel}
                        >
                            <RotateCcw color={theme.colors.white} size={24} />
                            <Text style={styles.actionBtnText}>Tekrar</Text>
                        </TouchableOpacity>

                        {levelId < 10 && (
                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: theme.colors.purple }]}
                                onPress={() => navigation.replace('MemoryGame', { levelId: levelId + 1 })}
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

    const cardSize = getCardSize();

    return (
        <Layout>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backBtnText}>←</Text>
                </TouchableOpacity>

                <View style={styles.levelBadge}>
                    <Eye color={theme.colors.accent} size={18} />
                    <Text style={styles.levelBadgeText}>Seviye {level.id}</Text>
                </View>

                <View style={styles.statsBox}>
                    {gameState === 'preview' ? (
                        <Text style={styles.countdownText}>👀 {countdown}</Text>
                    ) : (
                        <>
                            <Text style={styles.statsText}>🎯 {moves}</Text>
                            <Text style={styles.statsText}>⏱️ {formatTime(elapsedTime)}</Text>
                        </>
                    )}
                </View>
            </View>

            {/* Game Instructions */}
            {gameState === 'preview' && (
                <View style={styles.previewBanner}>
                    <Text style={styles.previewText}>Kartları ezberle! 🧠</Text>
                </View>
            )}

            {/* Cards Grid */}
            <View style={styles.cardsContainer}>
                <View style={styles.cardsGrid}>
                    {cards.map((card) => {
                        const isFlipped = flippedCards.find(c => c.id === card.id);
                        const isMatched = matchedPairs.includes(card.pairId);
                        const showFace = gameState === 'preview' || isFlipped || isMatched;

                        return (
                            <TouchableOpacity
                                key={card.id}
                                style={[
                                    styles.card,
                                    { width: cardSize, height: cardSize },
                                    showFace && styles.cardFlipped,
                                    isMatched && styles.cardMatched,
                                ]}
                                onPress={() => handleCardPress(card)}
                                disabled={gameState !== 'playing' || isMatched}
                            >
                                {showFace ? (
                                    <Text style={[styles.cardEmoji, { fontSize: cardSize * 0.5 }]}>
                                        {card.emoji}
                                    </Text>
                                ) : (
                                    <Text style={[styles.cardBack, { fontSize: cardSize * 0.4 }]}>❓</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Progress */}
            <View style={styles.progressSection}>
                <Text style={styles.progressText}>
                    Eşleşen: {matchedPairs.length} / {level.pairs}
                </Text>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${(matchedPairs.length / level.pairs) * 100}%` }
                        ]}
                    />
                </View>
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
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    levelBadgeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.accent,
    },
    statsBox: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    statsText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    countdownText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.secondary,
    },
    previewBanner: {
        backgroundColor: theme.colors.gold,
        paddingVertical: 12,
        borderRadius: 15,
        marginBottom: 15,
    },
    previewText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.white,
        textAlign: 'center',
    },
    cardsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    card: {
        backgroundColor: theme.colors.accent,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    cardFlipped: {
        backgroundColor: 'rgba(255,255,255,0.95)',
    },
    cardMatched: {
        backgroundColor: theme.colors.success,
        opacity: 0.8,
    },
    cardEmoji: {
        textAlign: 'center',
    },
    cardBack: {
        textAlign: 'center',
    },
    progressSection: {
        marginTop: 15,
        alignItems: 'center',
    },
    progressText: {
        fontSize: 14,
        color: theme.colors.text,
        marginBottom: 8,
    },
    progressBar: {
        width: '100%',
        height: 10,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.success,
        borderRadius: 5,
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
        padding: 25,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 4,
        gap: 15,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    scoreLabel: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    passedText: {
        fontSize: 16,
        color: theme.colors.success,
        fontWeight: '600',
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

export default MemoryGameScreen;
