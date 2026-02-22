import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Lead } from '../types';
import { COLORS } from '../constants/theme';
import { Phone, MapPin, User, Car, Wrench, ArrowLeft, CheckCircle, XCircle, MessageSquare } from 'lucide-react-native';
import LeadQuestionnaireSummary from '../components/LeadQuestionnaireSummary';

import { getLeadDetails, submitOffer, skipLead, getProfile } from '../services/api';
import { ActivityIndicator } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'LeadDetails'>;

export default function LeadDetailsScreen({ navigation, route }: Props) {
    const { leadId } = route.params;
    // ... rest of component

    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [dealerProfile, setDealerProfile] = useState<any>(null);

    useEffect(() => {
        loadDealerProfile();
    }, []);

    const loadDealerProfile = async () => {
        try {
            const data = await getProfile();
            setDealerProfile(data);
        } catch (error) {
            console.log('Error loading profile for whatsapp func', error);
        }
    };

    useEffect(() => {
        loadLeadDetails();
    }, [leadId]);

    const loadLeadDetails = async () => {
        try {
            setLoading(true);
            const data = await getLeadDetails(leadId);
            const rawData = data as any;
            console.log('Lead Status Raw:', rawData.status);

            // Normalize status to uppercase and handle variations
            const normalizedStatus = rawData.status
                ? rawData.status.toUpperCase().replace(' ', '_') // Convert 'New Lead' -> 'NEW_LEAD'
                : 'NEW';

            const normalizedData = {
                ...rawData,
                status: normalizedStatus
            };

            setLead(normalizedData as Lead);
        } catch (error) {
            Alert.alert('Error', 'Failed to load lead details');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleCall = () => {
        // customerPhone is top-level on the backend LeadDetailsResponse
        const mobile = (lead as any)?.customerPhone || '9876543210';
        Linking.openURL(`tel:${mobile}`);
    };
    const handleMap = () => Alert.alert('Map', 'Opening maps...');

    const handleMakeOffer = () => {
        navigation.navigate('OfferSubmission', { leadId });
    };

    const handleWhatsApp = async () => {
        if (!lead) return;

        const phoneNumber = '7995183828'; // 10-digit India number
        const countryCode = '91';

        const dealerName = dealerProfile?.businessName || 'Authorized Dealer';
        // address is a flat string from the backend (e.g. "123 MG Road, Bangalore, Karnataka")
        const dealerLocation = dealerProfile?.address || dealerProfile?.location || 'Your City';
        const dealerContact = dealerProfile?.mobile || '9XXXXXXXXX';

        const message =
            "Hi 👋\n\n" +
            "Thank you for your tyre enquiry.\n\n" +
            "You’ll be assisted by our authorized dealer:\n\n" +
            `🏪 Dealer: ${dealerName}\n` +
            `📍 Location: ${dealerLocation}\n` +
            `📞 Contact: +91 ${dealerContact}\n\n` +
            "Please feel free to share your requirement — the dealer will assist you shortly.";


        const cleanPhone = phoneNumber.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);

        const whatsappUrl = `https://wa.me/${countryCode}${cleanPhone}?text=${encodedMessage}`;

        try {
            await Linking.openURL(whatsappUrl);
        } catch (error) {
            Alert.alert('Error', 'Could not open WhatsApp');
        }
    };


    // handleMarkConverted removed as it's no longer part of the new flow

    const handleSkip = () => {
        Alert.alert('Skip Lead', 'Lead marked as skipped.', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.teal.main} />
            </View>
        );
    }

    if (!lead) return null;

    // Determine Status Badge Color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW': return COLORS.teal.main;
            case 'NEW_LEAD': return COLORS.teal.main;
            case 'FOLLOW_UP': return '#F97316';
            case 'BOUGHT': return '#F97316'; // Bought lead = Follow up
            case 'CONVERTED': return '#22C55E'; // Green
            default: return COLORS.gray[500];
        }
    };

    return (
        <View style={styles.container}>
            {/* Custom Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lead #{leadId.substring(0, 8)}...</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Status Banner */}
                <View style={[styles.statusBanner, { borderColor: getStatusColor(lead.status) }]}>
                    <Text style={[styles.statusLabel, { color: getStatusColor(lead.status) }]}>Status:</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lead.status) }]}>
                        <Text style={styles.statusText}>{lead.status.replace('_', ' ')}</Text>
                    </View>
                </View>

                {/* Customer Details Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Customer Details</Text>
                    <View style={styles.row}>
                        <User size={20} color={COLORS.gray[500]} />
                        <View>
                            <Text style={styles.label}>Name</Text>
                            <Text style={styles.value}>{lead.customerName}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <MapPin size={20} color={COLORS.gray[500]} />
                        <View>
                            <Text style={styles.label}>Location</Text>
                            <Text style={styles.value}>{lead.location}</Text>
                        </View>
                    </View>
                </View>

                {/* Vehicle Info Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Vehicle Information</Text>
                    <View style={styles.row}>
                        <Car size={20} color={COLORS.gray[500]} />
                        <View>
                            <Text style={styles.label}>Model</Text>
                            <Text style={styles.value}>{lead.vehicleModel}</Text>
                        </View>
                    </View>
                </View>

                {/* Questionnaire Summary */}
                {lead.questionnaire && (
                    <LeadQuestionnaireSummary data={lead.questionnaire} />
                )}

                {/* Requirement Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Service Requirement</Text>
                    <View style={styles.row}>
                        <Wrench size={20} color={COLORS.gray[500]} />
                        <View>
                            <Text style={styles.label}>Requested Service</Text>
                            <Text style={styles.value}>{lead.serviceRequest}</Text>
                        </View>
                    </View>
                </View>

                {/* Action Grid */}
                {/* <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                        <Phone size={24} color={COLORS.teal.main} />
                        <Text style={styles.actionText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={handleMap}>
                        <MapPin size={24} color={COLORS.teal.main} />
                        <Text style={styles.actionText}>Map</Text>
                    </TouchableOpacity>
                </View> */}

            </ScrollView>

            {/* Bottom Actions based on Status */}
            <View style={styles.footer}>

                {(lead.status === 'NEW' || lead.status === 'NEW_LEAD') && (
                    <>
                        <TouchableOpacity style={[styles.footerButton, styles.buyButton]} onPress={handleMakeOffer}>
                            <CheckCircle size={20} color={COLORS.white} />
                            <Text style={styles.buyButtonText}>Make an Offer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.footerButton, styles.skipButton]} onPress={handleSkip}>
                            <XCircle size={20} color={COLORS.gray[700]} />
                            <Text style={styles.skipButtonText}>Skip Lead</Text>
                        </TouchableOpacity>
                    </>
                )}

                {(lead.status === 'FOLLOW_UP' || lead.status === 'BOUGHT') && (
                    <TouchableOpacity style={[styles.footerButton, { backgroundColor: '#25D366', borderColor: '#25D366' }]} onPress={handleWhatsApp}>
                        <Text style={styles.buyButtonText}>Chat on WhatsApp</Text>
                    </TouchableOpacity>
                )}

                {lead.status === 'CONVERTED' && (
                    <View style={[styles.footerButton, { backgroundColor: COLORS.gray[100], borderColor: COLORS.gray[200] }]}>
                        <CheckCircle size={20} color={COLORS.teal.main} />
                        <Text style={[styles.buyButtonText, { color: COLORS.teal.main }]}>Lead Converted</Text>
                    </View>
                )}

                {/* Fallback for other statuses like LOST if any */}
                {(lead.status !== 'NEW' && lead.status !== 'NEW_LEAD' && lead.status !== 'FOLLOW_UP' && lead.status !== 'BOUGHT' && lead.status !== 'CONVERTED') && (
                    <View style={[styles.footerButton, { backgroundColor: COLORS.gray[100], borderStyle: 'dashed', borderColor: COLORS.gray[400] }]}>
                        <Text style={[styles.buyButtonText, { color: COLORS.gray[500] }]}>Action Unavailable</Text>
                    </View>
                )}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[50], // Slightly gray background for contrast
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: COLORS.white,
        paddingTop: 60, // Safe area
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.black,
    },
    content: {
        padding: 16,
        paddingBottom: 100, // Space for footer
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.teal.lighter,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.teal.light,
    },
    statusLabel: {
        fontSize: 16,
        color: COLORS.teal.dark,
        fontWeight: '600',
    },
    statusBadge: {
        backgroundColor: COLORS.teal.main,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 12,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.gray[100],
        marginVertical: 12,
    },
    label: {
        fontSize: 12,
        color: COLORS.gray[500],
        marginBottom: 2,
    },
    value: {
        fontSize: 16,
        color: COLORS.black,
        fontWeight: '500',
    },
    actionGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    actionButton: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray[200],
        gap: 8,
    },
    actionText: {
        color: COLORS.teal.main,
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        padding: 16,
        paddingBottom: 32,
        flexDirection: 'row',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[200],
    },
    footerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        gap: 8,
        borderWidth: 1,
    },
    buyButton: {
        backgroundColor: COLORS.teal.main,
        borderColor: COLORS.teal.main,
    },
    buyButtonText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 16,
    },
    skipButton: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.gray[300],
    },
    skipButtonText: {
        color: COLORS.gray[700],
        fontWeight: '600',
        fontSize: 16,
    },
});
