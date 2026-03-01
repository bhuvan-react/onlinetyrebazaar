import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { COLORS } from '../constants/theme';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Wallet, CreditCard, History, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { getWalletData, getPackages, initiateRecharge, completeRecharge } from '../services/api';

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
    const route = useRoute<any>();
    const [walletData, setWalletData] = useState<any>({
        balance: 0,
        packages: [],
        history: []
    });
    const [loading, setLoading] = useState(false);
    const [packagesLoading, setPackagesLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadWallet();
        }, [])
    );

    const loadWallet = async () => {
        try {
            const [walletDataResponse, packagesData]: [any, any] = await Promise.all([
                getWalletData(),
                getPackages()
            ]);

            setWalletData({
                balance: walletDataResponse.totalCredits || 0,
                packages: (packagesData && packagesData.length > 0)
                    ? packagesData.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        price: p.price ?? `₹ ${p.priceInInr}`,
                        credits: p.credits ?? `${p.totalCredits} Credits`,
                        popular: p.popular
                    }))
                    : [],
                history: walletDataResponse.transactions || []
            });
        } catch (error) {
            console.log('Failed to load wallet data', error);
            // Show hardcoded packages as last resort fallback (they won't have real UUIDs)
            // so keep packages empty to prevent 400 errors on initiate
        } finally {
            setLoading(false);
            setPackagesLoading(false);
        }
    };

    const handleBuyPackage = async (pkgId: string, pkgName: string) => {
        setLoading(true);
        try {
            // 1. Get Razorpay Order ID from backend
            const orderRes: any = await initiateRecharge(pkgId);

            // 2. Navigate to the WebView Razorpay payment screen
            navigation.navigate('RazorpayPayment', {
                gatewayOrderId: orderRes.orderId,
                amountInPaise: orderRes.amount,
                currency: orderRes.currency,
                keyId: orderRes.key,
                packageId: pkgId,
                packageName: pkgName,
            });
        } catch (error: any) {
            const msg = error?.message?.includes('401') ? 'Session expired. Please login again.' : 'Failed to initiate payment. Please try again.';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };



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
                    {walletData?.packages?.slice(0, 3).map((pkg: any) => (
                        <TouchableOpacity
                            key={pkg.id}
                            style={styles.addMoneyButton}
                            onPress={() => handleBuyPackage(pkg.id, pkg.name)}
                            disabled={loading}
                        >
                            <Plus size={12} color={COLORS.teal.dark} />
                            <Text style={styles.addMoneyText}>{pkg.name} ({pkg.price})</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Wallet size={80} color="rgba(255,255,255,0.08)" style={styles.bgIcon} />
            </View>
            {/* Packages Section */}
            <Text style={styles.sectionTitle}>Buy Credits</Text>
            {packagesLoading ? (
                <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                    <Text style={{ color: COLORS.gray[500], fontSize: 14 }}>Loading packages...</Text>
                </View>
            ) : (
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
            )}

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
