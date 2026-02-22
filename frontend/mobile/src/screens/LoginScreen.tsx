import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import Header from '../components/Header';
import { COLORS } from '../constants/theme';
import { loginWithPassword } from '../services/api';

type LoginScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Login'
>;

interface Props {
    navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!identifier || !password) {
            Alert.alert('Error', 'Please enter mobile/email and password');
            return;
        }

        try {
            setLoading(true);
            await loginWithPassword(identifier, password);
            // Navigate to MainTabs (Dashboard) after successful login
            navigation.replace('MainTabs', { screen: 'Dashboard' });
        } catch (error) {
            Alert.alert('Error', 'Login Failed. Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Header subtitle="Dealer Portal" />

            {/* Title */}
            <Text style={styles.title}>📱 LOGIN</Text>

            {/* Unified Login Section */}
            <View style={styles.section}>
                <Text style={styles.label}>Mobile Number / Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Mobile Number or Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={identifier}
                    onChangeText={setIdentifier}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.primaryButton, loading && { opacity: 0.7 }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.primaryButtonText}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                <Text style={styles.newDealerText}>New Dealer?</Text>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('FullDealerRegister')}
                >
                    <Text style={styles.secondaryButtonText}>Register Your Business</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    contentContainer: {
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.teal.dark,
        textAlign: 'center',
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray[700],
        marginBottom: 8,
    },
    mobileInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    prefix: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.gray[700],
        marginRight: 8,
    },
    mobileInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    primaryButton: {
        backgroundColor: COLORS.teal.main,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    forgotPassword: {
        color: COLORS.teal.main,
        fontSize: 14,
        textAlign: 'right',
        marginBottom: 16,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.gray[300],
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: COLORS.gray[500],
        fontWeight: '600',
    },
    bottomSection: {
        marginTop: 32,
        alignItems: 'center',
    },
    newDealerText: {
        fontSize: 16,
        color: COLORS.gray[700],
        marginBottom: 16,
    },
    secondaryButton: {
        backgroundColor: COLORS.teal.light,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
    },
    secondaryButtonText: {
        color: COLORS.teal.dark,
        fontSize: 16,
        fontWeight: '600',
    },
    roadsideButton: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.teal.main,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    roadsideButtonText: {
        color: COLORS.teal.dark,
        fontSize: 16,
        fontWeight: '600',
    },
});
