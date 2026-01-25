import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Trophy, Medal, Crown } from 'lucide-react-native';
import Layout from '../components/Layout';
import theme from '../constants/theme';
import { getLeaderboard } from '../utils/LeaderboardManager';

const LeaderboardScreen = ({ navigation }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const data = await getLeaderboard();
        setEntries(data);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const getRankIcon = (index) => {
        switch (index) {
            case 0:
                return <Crown size={24} color="#FFD700" fill="#FFD700" />;
            case 1:
                return <Medal size={24} color="#C0C0C0" />;
            case 2:
                return <Medal size={24} color="#CD7F32" />;
            default:
                return <Text style={styles.rankNumber}>{index + 1}</Text>;
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>←</Text>
                </TouchableOpacity>
                <View style={styles.titleRow}>
                    <Trophy color={theme.colors.gold} size={28} />
                    <Text style={styles.title}>Liderlik Tablosu</Text>
                </View>
                <View style={styles.placeholder} />
            </View>

            {entries.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Trophy size={60} color={theme.colors.textLight} />
                    <Text style={styles.emptyTitle}>Henüz Kayıt Yok</Text>
                    <Text style={styles.emptyText}>
                        Zaman Yarışı modunu oynayarak buraya adını yazdır!
                    </Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
                >
                    {entries.map((entry, index) => (
                        <View
                            key={entry.id}
                            style={[
                                styles.entryCard,
                                index === 0 && styles.goldCard,
                                index === 1 && styles.silverCard,
                                index === 2 && styles.bronzeCard,
                            ]}
                        >
                            <View style={styles.rankContainer}>
                                {getRankIcon(index)}
                            </View>
                            <View style={styles.entryInfo}>
                                <Text style={styles.entryName}>{entry.name}</Text>
                                <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                            </View>
                            <Text style={styles.entryScore}>{entry.score}</Text>
                        </View>
                    ))}
                </ScrollView>
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
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    placeholder: {
        width: 40,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 15,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginTop: 8,
    },
    list: {
        gap: 10,
        paddingBottom: 20,
    },
    entryCard: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
    },
    goldCard: {
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    silverCard: {
        borderWidth: 2,
        borderColor: '#C0C0C0',
    },
    bronzeCard: {
        borderWidth: 2,
        borderColor: '#CD7F32',
    },
    rankContainer: {
        width: 40,
        alignItems: 'center',
    },
    rankNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textLight,
    },
    entryInfo: {
        flex: 1,
        marginLeft: 12,
    },
    entryName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    entryDate: {
        fontSize: 13,
        color: theme.colors.textLight,
    },
    entryScore: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.gold,
    },
});

export default LeaderboardScreen;
