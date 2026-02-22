import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/theme';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { submitOffer } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'OfferSubmission'>;

const CONDITIONS = ['New', 'Good', 'Fair', 'Needs Repair'];

export default function OfferSubmissionScreen({ navigation, route }: Props) {
    const { leadId } = route.params;

    const [price, setPrice] = useState('');
    const [condition, setCondition] = useState('New');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!price || isNaN(Number(price))) {
            Alert.alert('Validation Error', 'Please enter a valid price.');
            return;
        }

        const offerDetails = {
            price: Number(price),
            condition: condition,
            notes: notes
        };

        setLoading(true);
        try {
            await submitOffer(leadId, offerDetails);
            Alert.alert(
                'Offer Submitted',
                'Your offer has been sent to the customer successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('MainTabs', {
                                screen: 'Leads',
                                params: { filter: 'All' }
                            });
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Submit offer error:', error);
            Alert.alert('Error', 'Failed to submit offer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Submit Offer</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionText}>Provide a competitive offer for Lead #{leadId.substring(0, 8)}</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Price (₹) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 5000"
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tyre Condition</Text>
                    <View style={styles.conditionContainer}>
                        {CONDITIONS.map((c) => (
                            <TouchableOpacity
                                key={c}
                                style={[styles.conditionChip, condition === c ? styles.activeConditionChip : null]}
                                onPress={() => setCondition(c)}
                            >
                                <Text style={[styles.conditionText, condition === c ? styles.activeConditionText : null]}>{c}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Additional Notes</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Any additional details or terms..."
                        multiline
                        numberOfLines={4}
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.submitButton, loading ? styles.disabledButton : null]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <>
                            <CheckCircle size={20} color={COLORS.white} />
                            <Text style={styles.submitButtonText}>Submit Offer</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[50]
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: COLORS.white,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200]
    },
    backButton: { padding: 8 },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.black
    },
    content: {
        padding: 20
    },
    sectionText: {
        fontSize: 14,
        color: COLORS.gray[600],
        marginBottom: 24,
        lineHeight: 20
    },
    inputGroup: {
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.black,
        marginBottom: 8
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: COLORS.black
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    },
    conditionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    conditionChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
        backgroundColor: COLORS.white
    },
    activeConditionChip: {
        borderColor: COLORS.teal.main,
        backgroundColor: COLORS.teal.lighter
    },
    conditionText: {
        fontSize: 14,
        color: COLORS.gray[600]
    },
    activeConditionText: {
        color: COLORS.teal.dark,
        fontWeight: '600'
    },
    footer: {
        padding: 20,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[200]
    },
    submitButton: {
        backgroundColor: COLORS.teal.main,
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8
    },
    disabledButton: {
        opacity: 0.7
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700'
    }
});
