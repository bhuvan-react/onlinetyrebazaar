import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { COLORS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { User, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { getNotificationSettings } from '../services/api';

export default function SettingsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [whatsappEnabled, setWhatsappEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const settings = await getNotificationSettings() as any;
            setPushEnabled(settings.pushEnabled);
            setEmailEnabled(settings.emailEnabled);
            setWhatsappEnabled(settings.whatsappEnabled);
            setSoundEnabled(settings.soundEnabled);
        } catch (error) {
            console.log('Failed to load settings');
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: () => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                }
            },
        ]);
    };

    const SettingItem = ({ icon: Icon, label, onPress, value }: any) => (
        <TouchableOpacity style={styles.item} onPress={onPress} disabled={!onPress}>
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, { backgroundColor: COLORS.gray[100] }]}>
                    <Icon size={20} color={COLORS.gray[700]} />
                </View>
                <Text style={styles.itemLabel}>{label}</Text>
            </View>
            {value !== undefined ? (
                value
            ) : (
                <ChevronRight size={20} color={COLORS.gray[400]} />
            )}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>Settings</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.card}>
                    <SettingItem icon={User} label="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
                    <SettingItem icon={Shield} label="Privacy & Security" onPress={() => { }} />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                <View style={styles.card}>
                    <SettingItem
                        icon={Bell}
                        label="Push Notifications"
                        value={
                            <Switch
                                value={pushEnabled}
                                onValueChange={setPushEnabled}
                                trackColor={{ false: COLORS.gray[200], true: COLORS.teal.main }}
                            />
                        }
                    />
                    <SettingItem
                        icon={Bell}
                        label="Email Alerts"
                        value={
                            <Switch
                                value={emailEnabled}
                                onValueChange={setEmailEnabled}
                                trackColor={{ false: COLORS.gray[200], true: COLORS.teal.main }}
                            />
                        }
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <View style={styles.card}>
                    <SettingItem icon={HelpCircle} label="Help & Support" onPress={() => { }} />
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={20} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Version 1.0.0</Text>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[50], // Light gray bg
    },
    content: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray[500],
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[100],
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemLabel: {
        fontSize: 16,
        color: COLORS.black,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FEF2F2',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FECACA',
        marginBottom: 24,
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        color: COLORS.gray[400],
        fontSize: 12,
    },
    valueText: {
        fontSize: 14,
        color: COLORS.gray[500],
        marginRight: 8,
    },
});
