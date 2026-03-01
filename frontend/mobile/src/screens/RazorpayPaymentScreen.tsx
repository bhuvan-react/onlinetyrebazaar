import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/theme';
import { X } from 'lucide-react-native';
import { getProfile, completeRecharge } from '../services/api';

type RazorpayRoute = RouteProp<RootStackParamList, 'RazorpayPayment'>;

export default function RazorpayPaymentScreen() {
    const route = useRoute<RazorpayRoute>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const webViewRef = useRef<WebView>(null);
    const [dealerMobile, setDealerMobile] = useState(route.params.dealerMobile ?? '');
    const [dealerEmail, setDealerEmail] = useState(route.params.dealerEmail ?? '');
    const [verifying, setVerifying] = useState(false);

    const { gatewayOrderId, amountInPaise, currency, keyId, packageId, packageName } = route.params;

    // Fetch dealer profile to pre-fill mobile/email in Razorpay
    useEffect(() => {
        if (!dealerMobile) {
            getProfile()
                .then((profile: any) => {
                    if (profile?.mobile) setDealerMobile(profile.mobile);
                    if (profile?.email) setDealerEmail(profile.email);
                })
                .catch(() => {}); // Non-critical, prefill is optional
        }
    }, []);

    // Build the HTML only once we have the values
    const razorpayHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>Checkout</title>
    <style>
        body { margin: 0; background: #f4f4f4; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; }
        .msg { color: #555; font-size: 16px; text-align: center; padding: 20px; line-height:1.6; }
    </style>
</head>
<body>
    <div class="msg">Opening payment gateway...<br/>Please wait.</div>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <script>
        var options = {
            key: "${keyId}",
            amount: ${amountInPaise},
            currency: "${currency}",
            name: "Online Tyre Bazaar",
            description: "Wallet Recharge: ${packageName}",
            order_id: "${gatewayOrderId}",
            prefill: {
                contact: "${dealerMobile}",
                email: "${dealerEmail}"
            },
            theme: { color: "#14b8a6" },
            handler: function(response) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: "success",
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                }));
            },
            modal: {
                ondismiss: function() {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: "cancelled" }));
                },
                escape: false,
                backdropclose: false
            }
        };
        var rzp = new Razorpay(options);
        rzp.on("payment.failed", function(response) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: "failed",
                code: response.error.code,
                description: response.error.description
            }));
        });
        rzp.open();
    </script>
</body>
</html>
`;

    const handleMessage = async (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.type === 'success') {
                // Verify payment directly here — don't pass via navigation params
                setVerifying(true);
                try {
                    await completeRecharge({
                        gatewayOrderId: data.razorpay_order_id,
                        gatewayPaymentId: data.razorpay_payment_id,
                        gatewaySignature: data.razorpay_signature,
                        packageId,
                    });
                    Alert.alert(
                        '✅ Payment Successful',
                        'Credits have been added to your wallet!',
                        [{ text: 'OK', onPress: () => navigation.goBack() }]
                    );
                } catch (err) {
                    Alert.alert(
                        'Verification Issue',
                        'Payment received, but credit update failed. Contact support with your payment ID: ' + data.razorpay_payment_id,
                        [{ text: 'OK', onPress: () => navigation.goBack() }]
                    );
                } finally {
                    setVerifying(false);
                }
            } else if (data.type === 'cancelled') {
                navigation.goBack();
            } else if (data.type === 'failed') {
                Alert.alert('Payment Failed', data.description || 'Something went wrong.', [
                    { text: 'Go Back', onPress: () => navigation.goBack() },
                    { text: 'Try Again', style: 'cancel' }
                ]);
            }
        } catch (e) {
            console.error('WebView message parse error', e);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Add Credits — ₹{amountInPaise / 100}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <X size={20} color={COLORS.black} />
                </TouchableOpacity>
            </View>

            {verifying && (
                <View style={styles.verifyOverlay}>
                    <ActivityIndicator size="large" color={COLORS.teal.main} />
                    <Text style={styles.verifyText}>Verifying payment...</Text>
                </View>
            )}

            <WebView
                ref={webViewRef}
                source={{ html: razorpayHTML }}
                onMessage={handleMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                mixedContentMode="always"
                renderLoading={() => (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={COLORS.teal.main} />
                        <Text style={styles.loaderText}>Loading payment gateway...</Text>
                    </View>
                )}
                style={styles.webview}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: COLORS.white,
    },
    headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.black },
    closeBtn: { padding: 4 },
    webview: { flex: 1 },
    loader: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    loaderText: { marginTop: 12, color: '#6B7280', fontSize: 14 },
    verifyOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 99,
        backgroundColor: 'rgba(255,255,255,0.92)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifyText: { marginTop: 12, fontSize: 16, fontWeight: '600', color: COLORS.teal.dark },
});
