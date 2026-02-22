import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../constants/theme';
import { TrendingUp, Clock, Star, Users } from 'lucide-react-native';
import { getStatsData } from '../services/api';

export default function StatsScreen() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await getStatsData();
            setStats(data);
        } catch (error) {
            console.log('Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>Performance Overview</Text>

            {/* Performance Score Circle */}
            <View style={styles.scoreCard}>
                <View style={styles.scoreCircle}>
                    <Text style={styles.scoreValue}>{stats?.performanceScore}</Text>
                    <Text style={styles.scoreLabel}>/ 10</Text>
                </View>
                <Text style={styles.scoreText}>Excellent Performance!</Text>
                <Text style={styles.scoreSubtext}>You are top {stats?.percentile} in your area</Text>
            </View>

            {/* Metrics Grid */}
            <View style={styles.grid}>
                <View style={styles.metricCard}>
                    <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                        <Users size={20} color="#0284C7" />
                    </View>
                    <Text style={styles.metricValue}>{stats?.metrics.totalLeads}</Text>
                    <Text style={styles.metricLabel}>Total Leads</Text>
                </View>
                <View style={styles.metricCard}>
                    <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                        <TrendingUp size={20} color="#16A34A" />
                    </View>
                    <Text style={styles.metricValue}>{stats?.metrics.conversionRate}</Text>
                    <Text style={styles.metricLabel}>Conversion</Text>
                </View>
                <View style={styles.metricCard}>
                    <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                        <Star size={20} color="#D97706" />
                    </View>
                    <Text style={styles.metricValue}>{stats?.metrics.avgRating}</Text>
                    <Text style={styles.metricLabel}>Avg. Rating</Text>
                </View>
                <View style={styles.metricCard}>
                    <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
                        <Clock size={20} color="#9333EA" />
                    </View>
                    <Text style={styles.metricValue}>{stats?.metrics.avgResponseTime}</Text>
                    <Text style={styles.metricLabel}>Avg. Response</Text>
                </View>
            </View>

            {/* Reviews Breakdown */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Customer Satisfaction</Text>
                {stats?.ratingBreakdown.map((item: any, index: number) => (
                    <View key={index} style={styles.ratingRow}>
                        <Text style={styles.ratingLabel}>{item.label}</Text>
                        <View style={styles.barBg}>
                            <View style={[styles.barFill, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
                        </View>
                        <Text style={styles.ratingCount}>{item.percentage}%</Text>
                    </View>
                ))}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    content: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 24,
    },
    scoreCard: {
        alignItems: 'center',
        backgroundColor: COLORS.teal.dark,
        borderRadius: 16,
        padding: 32,
        marginBottom: 32,
    },
    scoreCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 6,
        borderColor: COLORS.teal.main,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    scoreValue: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.white,
    },
    scoreLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    scoreText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.white,
        marginBottom: 4,
    },
    scoreSubtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 32,
    },
    metricCard: {
        width: '47%',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    metricValue: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 2,
    },
    metricLabel: {
        fontSize: 12,
        color: COLORS.gray[500],
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 16,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    ratingLabel: {
        width: 40,
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.gray[600],
    },
    barBg: {
        flex: 1,
        height: 8,
        backgroundColor: COLORS.gray[100],
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 4,
    },
    ratingCount: {
        width: 30,
        fontSize: 12,
        color: COLORS.gray[500],
        textAlign: 'right',
    },
});
