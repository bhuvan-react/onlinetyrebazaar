import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { COLORS } from '../constants/theme';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Wallet, CreditCard, History, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { getWalletData, getPackages, rechargeWallet } from '../services/api';

const PACKAGES = [
    { id: '1', name: 'Starter', price: '₹ 500', credits: '10 Leads' },
    { id: '2', name: 'Growth', price: '₹ 2,000', credits: '50 Leads', popular: true },
    { id: '3', name: 'Pro', price: '₹ 5,000', credits: '150 Leads' },
];

const HISTORY = [
    { id: '1', title: 'Added Money', date: 'Today, 10:00 AM', amount: '+ ₹ 2,000', type: 'credit' },
    { id: '2', title: 'Lead Purchase', date: 'Yesterday', amount: '- ₹ 50', type: 'debit' },
    { id: '3', title: 'Lead Purchase', date: '25 Dec', amount: '- ₹ 50', type: 'debit' },
    { id: '4', title: 'Added Money', date: '20 Dec', amount: '+ ₹ 500', type: 'credit' },
];

export default function WalletScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [walletData, setWalletData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadWallet();
        }, [])
    );

    const loadWallet = async () => {
        try {
            const [walletData, packagesData]: [any, any] = await Promise.all([
                getWalletData(),
                getPackages()
            ]);

            // Map API response to UI expected structure
            setWalletData({
                balance: walletData.totalCredits || 0,
                packages: packagesData || PACKAGES,
                history: walletData.transactions || []
            });
        } catch (error) {
            console.log('Failed to load wallet data', error);
        } finally {
            setLoading(false);
        }
    };

    const [addingCredits, setAddingCredits] = useState(false);

    // Quick top-up amounts (in credits) — maps to a fake packageId the backend ignores
    const QUICK_AMOUNTS = [
        { label: '100 Credits', packageId: 'quick-100' },
        { label: '500 Credits', packageId: 'quick-500' },
        { label: '1000 Credits', packageId: 'quick-1000' },
    ];

    const handleQuickAdd = async (packageId: string, label: string) => {
        setAddingCredits(true);
        try {
            await rechargeWallet(packageId);
            Alert.alert('✅ Credits Added', `${label} added to your wallet!`);
            loadWallet();
        } catch (error) {
            Alert.alert('Error', 'Failed to add credits. Make sure the backend is running.');
        } finally {
            setAddingCredits(false);
        }
    };

    const handleBuyPackage = async (pkgId: string, pkgName: string) => {
        Alert.alert(
            'Add Credits',
            `Add credits from the "${pkgName}" package?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Add Credits',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await rechargeWallet(pkgId);
                            Alert.alert('✅ Success', 'Credits added to your wallet!');
                            loadWallet();
                        } catch {
                            Alert.alert('Error', 'Failed to add credits.');
                            setLoading(false);
                        }
                    }
                }
            ]
        );
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

            {/* Balance Card */}
            <View style={styles.balanceCard}>
                <View>
                <Text style={styles.balanceLabel}>Current Credits</Text>
                <Text style={styles.balanceAmount}>{walletData?.balance ?? '—'}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 }}>
                    Each lead costs 50 credits
                </Text>
            </View>
            <View style={{ gap: 8, zIndex: 1 }}>
                {QUICK_AMOUNTS.map(q => (
                    <TouchableOpacity
                        key={q.packageId}
                        style={styles.addMoneyButton}
                        onPress={() => handleQuickAdd(q.packageId, q.label)}
                        disabled={addingCredits}
                    >
                        <Plus size={12} color={COLORS.teal.dark} />
                        <Text style={styles.addMoneyText}>{q.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Wallet size={80} color="rgba(255,255,255,0.08)" style={styles.bgIcon} />
            </View>

            {/* Packages Section */}
            <Text style={styles.sectionTitle}>Buy Credits</Text>
            <View style={styles.packagesGrid}>
                {walletData?.packages.map((pkg: any) => (
                    <TouchableOpacity
                        key={pkg.id}
                        style={[styles.packageCard, pkg.popular && styles.popularCard]}
                        onPress={() => handleBuyPackage(pkg.id, pkg.name)}
                    >
                        {pkg.popular && (
                            <View style={styles.popularBadge}>
                                <Text style={styles.popularText}>POPULAR</Text>
                            </View>
                        )}
                        <Text style={[styles.pkgName, pkg.popular && styles.textWhite]}>{pkg.name}</Text>
                        <Text style={[styles.pkgPrice, pkg.popular && styles.textWhite]}>{pkg.price}</Text>
                        <Text style={[styles.pkgCredits, pkg.popular && styles.textWhiteOpacity]}>{pkg.credits}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* History Section */}
            <Text style={styles.sectionTitle}>Transaction History</Text>
            <View style={styles.historyList}>
                {walletData?.history.map((item: any) => (
                    <View key={item.id} style={styles.historyItem}>
                        <View style={styles.historyLeft}>
                            <View style={[styles.iconBox, item.type === 'credit' ? styles.creditIcon : styles.debitIcon]}>
                                {item.type === 'credit' ? (
                                    <CreditCard size={16} color={COLORS.teal.main} />
                                ) : (
                                    <History size={16} color={COLORS.gray[500]} />
                                )}
                            </View>
                            <View>
                                <Text style={styles.historyTitle}>{item.title}</Text>
                                <Text style={styles.historyDate}>{item.date}</Text>
                            </View>
                        </View>
                        <Text style={[styles.historyAmount, item.type === 'credit' ? styles.textGreen : styles.textRed]}>
                            {item.amount}
                        </Text>
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
    balanceCard: {
        backgroundColor: COLORS.teal.dark,
        borderRadius: 16,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        overflow: 'hidden',
        height: 140,
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginBottom: 8,
    },
    balanceAmount: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: '700',
    },
    addMoneyButton: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        zIndex: 1,
    },
    addMoneyText: {
        color: COLORS.teal.dark,
        fontWeight: '600',
        fontSize: 14,
    },
    bgIcon: {
        position: 'absolute',
        right: -20,
        bottom: -20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 16,
    },
    packagesGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    packageCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    popularCard: {
        backgroundColor: COLORS.teal.main,
        borderColor: COLORS.teal.main,
        transform: [{ scale: 1.05 }],
        zIndex: 2,
    },
    popularBadge: {
        position: 'absolute',
        top: -10,
        backgroundColor: '#F59E0B',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    popularText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: '700',
    },
    pkgName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray[800],
        marginBottom: 4,
    },
    pkgPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 4,
    },
    pkgCredits: {
        fontSize: 12,
        color: COLORS.gray[500],
    },
    textWhite: {
        color: COLORS.white,
    },
    textWhiteOpacity: {
        color: 'rgba(255,255,255,0.8)',
    },
    historyList: {
        backgroundColor: COLORS.gray[50],
        borderRadius: 12,
        padding: 16,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    historyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    creditIcon: {
        backgroundColor: COLORS.teal.lighter,
    },
    debitIcon: {
        backgroundColor: COLORS.gray[200],
    },
    historyTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.black,
    },
    historyDate: {
        fontSize: 12,
        color: COLORS.gray[500],
    },
    historyAmount: {
        fontSize: 14,
        fontWeight: '600',
    },
    textGreen: {
        color: COLORS.teal.main,
    },
    textRed: {
        color: '#EF4444',
    },
});
