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
import { RootStackParamList, RoadsideFormData } from '../types';
import Header from '../components/Header';
import OTPModal from '../components/OTPModal';
import { COLORS } from '../constants/theme';
import { registerRoadsideDealer, sendOtp } from '../services/api';

type RoadsideRegisterScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'RoadsideRegister'
>;

interface Props {
    navigation: RoadsideRegisterScreenNavigationProp;
}

export default function RoadsideRegisterScreen({ navigation }: Props) {
    const [formData, setFormData] = useState<RoadsideFormData>({
        name: '',
        mobile: '',
        password: '',
        location: '',
    });
    const [otpModalVisible, setOtpModalVisible] = useState(false);

    const handleInputChange = (field: keyof RoadsideFormData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleUseCurrentLocation = () => {
        // Placeholder for location functionality
        Alert.alert('Location', 'Current location feature coming soon!');
        setFormData({ ...formData, location: 'Current Location (Demo)' });
    };

    const handleRegister = async () => {
        if (!formData.name || !formData.mobile || !formData.location || !formData.password) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }
        if (formData.mobile.length !== 10) {
            Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
            return;
        }
        try {
            await sendOtp(formData.mobile);
            setOtpModalVisible(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to send OTP.');
        }
    };

    const handleOtpVerify = async (otp: string) => {
        try {
            await registerRoadsideDealer(formData);
            setOtpModalVisible(false);
            Alert.alert(
                'Success',
                'Registration successful! Welcome to TyrePlus Roadside Dealer network.',
                [{ text: 'OK', onPress: () => navigation.replace('MainTabs', { screen: 'Dashboard' }) }]
            );
        } catch (error) {
            Alert.alert('Error', 'Registration failed. Please try again.');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Header subtitle="Roadside Dealer" />

            {/* Title */}
            <Text style={styles.title}>🛞 QUICK REGISTRATION</Text>
            <Text style={styles.subtitle}>
                Join our network of roadside dealers for second-hand tyres
            </Text>

            {/* Form Section */}
            <View style={styles.formSection}>
                <Text style={styles.label}>Your Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                />

                <Text style={styles.label}>Mobile Number *</Text>
                <View style={styles.mobileInputContainer}>
                    <Text style={styles.prefix}>+91</Text>
                    <TextInput
                        style={styles.mobileInput}
                        placeholder="Enter 10-digit mobile number"
                        keyboardType="phone-pad"
                        maxLength={10}
                        value={formData.mobile}
                        onChangeText={(value) => handleInputChange('mobile', value)}
                    />
                </View>

                <Text style={styles.label}>Password *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                />

                <Text style={styles.label}>Your Location *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your location"
                    value={formData.location}
                    onChangeText={(value) => handleInputChange('location', value)}
                />

                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={handleUseCurrentLocation}
                >
                    <Text style={styles.locationButtonText}>📍 Use Current Location</Text>
                </TouchableOpacity>
            </View>

            {/* Benefits Box */}
            <View style={styles.benefitsBox}>
                <Text style={styles.benefitsTitle}>Benefits of Joining</Text>
                <View style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>✓</Text>
                    <Text style={styles.benefitText}>Get listed on TyrePlus platform</Text>
                </View>
                <View style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>✓</Text>
                    <Text style={styles.benefitText}>Receive customer inquiries</Text>
                </View>
                <View style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>✓</Text>
                    <Text style={styles.benefitText}>Grow your business</Text>
                </View>
                <View style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>✓</Text>
                    <Text style={styles.benefitText}>Free registration & support</Text>
                </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Register Now</Text>
            </TouchableOpacity>

            {/* Full Dealer Link */}
            <TouchableOpacity
                style={styles.fullDealerLink}
                onPress={() => navigation.navigate('FullDealerRegister')}
            >
                <Text style={styles.fullDealerLinkText}>
                    Want to register as a full dealer?{' '}
                    <Text style={styles.fullDealerLinkBold}>Click here</Text>
                </Text>
            </TouchableOpacity>

            {/* OTP Modal */}
            <OTPModal
                visible={otpModalVisible}
                onClose={() => setOtpModalVisible(false)}
                onVerify={handleOtpVerify}
                phoneNumber={`+91 ${formData.mobile}`}
            />
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
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.gray[600],
        textAlign: 'center',
        marginBottom: 24,
    },
    formSection: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray[700],
        marginBottom: 8,
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
    locationButton: {
        backgroundColor: COLORS.teal.light,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    locationButtonText: {
        color: COLORS.teal.dark,
        fontSize: 16,
        fontWeight: '600',
    },
    benefitsBox: {
        backgroundColor: COLORS.teal.lighter,
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
    },
    benefitsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.teal.dark,
        marginBottom: 16,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    benefitIcon: {
        fontSize: 18,
        color: COLORS.teal.main,
        marginRight: 12,
        fontWeight: '700',
    },
    benefitText: {
        fontSize: 15,
        color: COLORS.gray[700],
    },
    registerButton: {
        backgroundColor: COLORS.teal.main,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    registerButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
    },
    fullDealerLink: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    fullDealerLinkText: {
        fontSize: 14,
        color: COLORS.gray[600],
    },
    fullDealerLinkBold: {
        color: COLORS.teal.main,
        fontWeight: '600',
    },
});
