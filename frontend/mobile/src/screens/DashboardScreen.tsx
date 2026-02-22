import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Wallet, TrendingUp, Users } from 'lucide-react-native';
import LeadCard from '../components/LeadCard';
import { getDashboardData } from '../services/api';

export default function DashboardScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [data, setData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const dashboardData = await getDashboardData();
            setData(dashboardData);
        } catch (error) {
            console.log('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleCall = () => {
        Alert.alert('Call', 'Calling customer...');
    };

    const handleLeadPress = (id: string) => {
        navigation.navigate('LeadDetails', { leadId: id });
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
            {/* Wallet Summary Card */}
            <View style={styles.walletCard}>
                <View>
                    <Text style={styles.walletLabel}>Wallet Balance</Text>
                    <Text style={styles.walletAmount}>₹ {data?.walletBalance}</Text>
                </View>
                <TouchableOpacity style={styles.addMoneyButton} onPress={() => navigation.navigate('MainTabs', { screen: 'Wallet' })}>
                    <Text style={styles.addMoneyText}>+ Add Money</Text>
                </TouchableOpacity>
                <Wallet size={80} color="rgba(255,255,255,0.1)" style={styles.walletIcon} />
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <View style={[styles.statIconInfos, { backgroundColor: '#E0F2FE' }]}>
                        <Users size={20} color="#0284C7" />
                    </View>
                    <Text style={styles.statValue}>{data?.stats.newLeads}</Text>
                    <Text style={styles.statLabel}>New Leads</Text>
                </View>
                <View style={styles.statCard}>
                    <View style={[styles.statIconInfos, { backgroundColor: '#DCFCE7' }]}>
                        <TrendingUp size={20} color="#16A34A" />
                    </View>
                    <Text style={styles.statValue}>{data?.stats.conversionRate}%</Text>
                    <Text style={styles.statLabel}>Conversion</Text>
                </View>
            </View>

            {/* New Leads Section */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>New Leads</Text>
                <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Leads' })}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.leadsList}>
                {data?.recentLeads.map((lead: any) => (
                    <LeadCard
                        key={lead.id}
                        name={lead.name}
                        vehicle={lead.vehicle}
                        location={lead.location}
                        date={lead.date}
                        status={lead.status}
                        onPress={() => handleLeadPress(lead.id)}
                    />
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
    walletCard: {
        backgroundColor: COLORS.teal.main,
        borderRadius: 16,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    walletLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 4,
    },
    walletAmount: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: '700',
    },
    addMoneyButton: {
        backgroundColor: COLORS.white,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    addMoneyText: {
        color: COLORS.teal.dark,
        fontWeight: '600',
        fontSize: 14,
    },
    walletIcon: {
        position: 'absolute',
        right: -10,
        bottom: -10,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
        alignItems: 'center',
    },
    statIconInfos: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 13,
        color: COLORS.gray[500],
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.black,
    },
    seeAllText: {
        color: COLORS.teal.main,
        fontWeight: '600',
        fontSize: 14,
    },
    leadsList: {
        gap: 0,
    },
});
