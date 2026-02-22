import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { OTPModalProps } from '../types';
import { COLORS } from '../constants/theme';

export default function OTPModal({
    visible,
    onClose,
    onVerify,
    phoneNumber,
}: OTPModalProps) {
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = React.useRef<Array<TextInput | null>>([]);

    const handleOtpChange = (value: string, index: number) => {
        if (value.length > 1) {
            value = value.charAt(0);
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const otpString = otp.join('');
        if (otpString.length !== 4) {
            Alert.alert('Error', 'Please enter a valid 4-digit OTP');
            return;
        }
        onVerify(otpString);
        setOtp(['', '', '', '']);
    };

    const handleClose = () => {
        setOtp(['', '', '', '']);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <Text style={styles.title}>Enter OTP</Text>
                    {phoneNumber && (
                        <Text style={styles.subtitle}>
                            We've sent a 4-digit code to {phoneNumber}
                        </Text>
                    )}

                    {/* OTP Inputs */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => {
                                    inputRefs.current[index] = ref;
                                }}
                                style={styles.otpInput}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.verifyButton]}
                            onPress={handleVerify}
                        >
                            <Text style={styles.verifyButtonText}>Verify OTP</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Resend OTP */}
                    <TouchableOpacity style={styles.resendContainer}>
                        <Text style={styles.resendText}>Didn't receive code? </Text>
                        <Text style={styles.resendLink}>Resend OTP</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 24,
        width: '90%',
        maxWidth: 400,
    },
    title: {
        fontSize: 24,
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
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    otpInput: {
        width: 45,
        height: 50,
        borderWidth: 2,
        borderColor: COLORS.teal.main,
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.black,
    },
    buttonContainer: {
        gap: 12,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    verifyButton: {
        backgroundColor: COLORS.teal.main,
    },
    verifyButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: COLORS.gray[100],
    },
    cancelButtonText: {
        color: COLORS.gray[700],
        fontSize: 16,
        fontWeight: '600',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    resendText: {
        fontSize: 14,
        color: COLORS.gray[600],
    },
    resendLink: {
        fontSize: 14,
        color: COLORS.teal.main,
        fontWeight: '600',
    },
});
