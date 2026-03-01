import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ScrollView, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/theme';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react-native';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
};

const BASE_URL = 'http://192.168.1.9:8081';

export default function ForgotPasswordScreen({ navigation }: Props) {
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading]       = useState(false);
    const [sent, setSent]             = useState(false);

    const handleSubmit = async () => {
        const val = identifier.trim();
        if (!val) {
            Alert.alert('Error', 'Please enter your mobile number or email.');
            return;
        }

        setLoading(true);
        try {
            await fetch(`${BASE_URL}/api/v1/auth/dealer/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: val }),
            });
            // Always show success — server deliberately doesn't reveal if account exists
            setSent(true);
        } catch {
            Alert.alert('Error', 'Network error. Check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Back button */}
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <ArrowLeft size={22} color={COLORS.teal.dark} />
            </TouchableOpacity>

            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
                Enter your registered mobile number or email. We'll send a reset link to your email.
            </Text>

            {sent ? (
                /* Success state */
                <View style={styles.successBox}>
                    <CheckCircle size={48} color={COLORS.teal.main} />
                    <Text style={styles.successTitle}>Email Sent!</Text>
                    <Text style={styles.successText}>
                        Check your inbox for a password reset link. It expires in 15 minutes.
                    </Text>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
                        <Text style={styles.btnText}>Back to Login</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                /* Input state */
                <View>
                    <View style={styles.inputRow}>
                        <Mail size={18} color={COLORS.gray[400]} style={{ marginRight: 8 }} />
                        <TextInput
                            style={styles.input}
                            placeholder="Mobile Number or Email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={identifier}
                            onChangeText={setIdentifier}
                        />
                    </View>
                    <TouchableOpacity
                        style={[styles.btn, loading && { opacity: 0.7 }]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color={COLORS.white} />
                            : <Text style={styles.btnText}>Send Reset Link</Text>}
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    content: { padding: 24, paddingTop: 60 },
    backBtn: { marginBottom: 24 },
    title: {
        fontSize: 26, fontWeight: '700', color: COLORS.teal.dark, marginBottom: 12,
    },
    subtitle: {
        fontSize: 14, color: COLORS.gray[500], lineHeight: 22, marginBottom: 32,
    },
    inputRow: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: COLORS.gray[300], borderRadius: 8,
        paddingHorizontal: 12, marginBottom: 20,
    },
    input: { flex: 1, paddingVertical: 13, fontSize: 15 },
    btn: {
        backgroundColor: COLORS.teal.main, paddingVertical: 14,
        borderRadius: 8, alignItems: 'center',
    },
    btnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
    successBox: { alignItems: 'center', marginTop: 40, gap: 16 },
    successTitle: { fontSize: 22, fontWeight: '700', color: COLORS.teal.dark },
    successText: {
        fontSize: 14, color: COLORS.gray[500], textAlign: 'center', lineHeight: 22,
    },
});
