import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Lead } from '../types';
import { COLORS } from '../constants/theme';
import { Phone, MapPin, User, Car, Wrench, ArrowLeft, CheckCircle, XCircle, MessageSquare, Check, Lock, ChevronDown } from 'lucide-react-native';
import LeadQuestionnaireSummary from '../components/LeadQuestionnaireSummary';

import { getLeadDetails, submitOffer, skipLead, getProfile, markLeadAsConverted, buyLead, markLeadAsNotSold } from '../services/api';
import { ActivityIndicator } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'LeadDetails'>;

export default function LeadDetailsScreen({ navigation, route }: Props) {
    const { leadId } = route.params;
    // ... rest of component

    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [dealerProfile, setDealerProfile] = useState<any>(null);
    const [whatsappClicked, setWhatsappClicked] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

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
                status: normalizedStatus,
                location: `${rawData.locationArea || ''} ${rawData.locationPincode || ''}`.trim() || 'N/A'
            };

            setLead(normalizedData as Lead);
        } catch (error) {
            Alert.alert('Error', 'Failed to load lead details');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsConverted = async () => {
        setIsLoading(true);
        try {
            await markLeadAsConverted(leadId);
            setShowUpdateModal(false);
            Alert.alert('Success', 'Lead marked as Delivery in Progress (Converted)!');
            navigation.goBack(); 
        } catch (error) {
            Alert.alert('Error', 'Failed to update lead status');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsNotSold = async () => {
        setIsLoading(true);
        try {
            await markLeadAsNotSold(leadId);
            setShowUpdateModal(false);
            // Alert.alert('Status Updated', 'Lead marked as Not Sold.'); // Optional, since it disappears
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to update lead status');
        } finally {
            setIsLoading(false);
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

    const handleWhatsApp = () => {
        if (!lead) return;

        const customerPhone = (lead as any)?.customerPhone || (lead as any)?.customerMobile;

        if (!customerPhone) {
            Alert.alert(
                'Phone Not Available',
                'Customer contact is only revealed after purchasing this lead.',
            );
            return;
        }

        // Dealer details
        const dealerBusiness = dealerProfile?.businessName || dealerProfile?.businessname || 'Authorized Dealer';
        const dealerPhone    = dealerProfile?.phoneNumber  || dealerProfile?.mobile       || '';

        // Tyre details
        const tyreBrand = (lead as any)?.tyreBrand || (lead as any)?.tyreInfo?.brand || 'the tyre';
        const tyreSize  = (lead as any)?.tyreSize  || (lead as any)?.tyreInfo?.size  || '';

        const message =
            `Hi! I'm from *${dealerBusiness}* on Online Tyre Bazaar.\n` +
            `You enquired about *${tyreBrand}${tyreSize ? ' ' + tyreSize : ''}*.\n` +
            `We have it available. Call us: ${dealerPhone}. When can you visit?`;

        const cleanPhone  = customerPhone.replace(/\D/g, '');
        const countryCode = cleanPhone.startsWith('91') ? '' : '91';
        const whatsappUrl = `https://wa.me/${countryCode}${cleanPhone}?text=${encodeURIComponent(message)}`;

        Linking.canOpenURL(whatsappUrl).then(supported => {
            setWhatsappClicked(true); // Enable the update button
            if (supported) {
                Linking.openURL(whatsappUrl);
            } else {
                // Fallback: open WhatsApp directly to the number without the message
                Linking.openURL(`https://wa.me/${countryCode}${cleanPhone}`);
            }
        }).catch(() => {
            Alert.alert('Error', 'Could not open WhatsApp. Make sure it is installed.');
        });
    };


    const handleBuyLead = async () => {
        console.log('check')
        Alert.alert(
            'Buy Lead',
            'This will deduct 30 credits from your wallet. The lead will appear in your Follow-up tab.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Buy Lead (30 Credits)',
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            await buyLead(leadId);
                            Alert.alert('Success', 'Lead purchased! Check your Follow-up tab.', [
                                { text: 'OK', onPress: () => navigation.goBack() }
                            ]);
                        } catch (e: any) {
                            const msg = e?.message?.includes('400') || e?.message?.includes('insufficient')
                                ? 'Insufficient wallet balance. Please recharge.'
                                : 'Failed to buy lead. Please try again.';
                            Alert.alert('Error', msg);
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleSkip = async () => {
        Alert.alert('Skip Lead', 'Are you sure you want to skip this lead?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Skip',
                style: 'destructive',
                onPress: async () => {
                    setIsLoading(true);
                    try {
                        await skipLead(leadId);
                        Alert.alert('Skipped', 'Lead moved to Skipped tab.', [
                            { text: 'OK', onPress: () => navigation.goBack() }
                        ]);
                    } catch {
                        Alert.alert('Error', 'Failed to skip lead.');
                    } finally {
                        setIsLoading(false);
                    }
                }
            }
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
            case 'DEALER_SELECTED': return '#F97316'; // Dealer selected = Follow up
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
                            <Text style={styles.label}>Model & Year</Text>
                            <Text style={styles.value}>{lead.vehicleModel}{lead.vehicleYear ? ` (${lead.vehicleYear})` : ''}</Text>
                        </View>
                    </View>
                </View>

                {/* Tyre Size Card */}
                {lead.tyreSize && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Required Tyre Size</Text>
                        <View style={styles.row}>
                            <View>
                                <Text style={styles.label}>Size</Text>
                                <Text style={styles.value}>{lead.tyreSize}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Specific Tyre Info Card (If customer selected a specific tyre) */}
                {lead.tyreInfo && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Requested Specific Tyre</Text>
                        <View style={styles.row}>
                            <View>
                                <Text style={styles.label}>Brand & Pattern</Text>
                                <Text style={styles.value}>{lead.tyreInfo.brand} {lead.tyreInfo.pattern}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                            <View>
                                <Text style={styles.label}>Price</Text>
                                <Text style={styles.value}>₹ {lead.tyreInfo.price}</Text>
                            </View>
                        </View>
                    </View>
                )}

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

                {/* CASE 1: LEAD CONVERTED */}
                {lead.status === 'CONVERTED' ? (
                    <View style={[styles.footerButton, { backgroundColor: COLORS.gray[100], borderColor: COLORS.gray[200] }]}>
                        <CheckCircle size={20} color={COLORS.teal.main} />
                        <Text style={[styles.buyButtonText, { color: COLORS.teal.main }]}>Lead Converted ✓</Text>
                    </View>
                ) : (lead as any).customerMobile ? (
                    /* CASE 2: LEAD PURCHASED (revealed contact) — show WhatsApp + Update Status */
                    <View style={{ flex: 1, gap: 10 }}>
                        {/* Primary: WhatsApp customer */}
                        <TouchableOpacity
                            style={[styles.footerButton, { backgroundColor: '#25D366', borderColor: '#25D366', flex: 0 }]}
                            onPress={handleWhatsApp}
                        >
                            <MessageSquare size={20} color={COLORS.white} />
                            <Text style={styles.buyButtonText}>Connect via WhatsApp</Text>
                        </TouchableOpacity>
                        
                        {/* Secondary: Update Lead Status */}
                        <TouchableOpacity
                            style={[
                                styles.footerButton, 
                                { 
                                    backgroundColor: whatsappClicked ? COLORS.teal.main : COLORS.gray[50], 
                                    borderColor: whatsappClicked ? COLORS.teal.main : COLORS.gray[200], 
                                    flex: 0 
                                }
                            ]}
                            onPress={() => setShowUpdateModal(true)}
                            disabled={!whatsappClicked || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <>
                                    {whatsappClicked ? (
                                        <CheckCircle size={20} color={COLORS.white} />
                                    ) : (
                                        <Lock size={18} color={COLORS.gray[400]} />
                                    )}
                                    <Text style={[
                                        styles.buyButtonText, 
                                        { color: whatsappClicked ? COLORS.white : COLORS.gray[400] }
                                    ]}>
                                        Update Lead Status
                                    </Text>
                                    {!whatsappClicked && <View style={styles.disabledOverlay} />}
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : lead.status === 'SKIPPED' ? (
                    /* CASE 3: SKIPPED — Buy from Skipped tab */
                    <TouchableOpacity
                        style={[styles.footerButton, styles.buyButton]}
                        onPress={handleBuyLead}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? <ActivityIndicator color={COLORS.white} />
                            : <><CheckCircle size={20} color={COLORS.white} /><Text style={styles.buyButtonText}>Buy Lead (1 Credit)</Text></>}
                    </TouchableOpacity>
                ) : (lead.status === 'VERIFIED' || lead.status === 'NEW' || lead.status === 'OFFER_RECEIVED') ? (
                    /* CASE 4: NOT PURCHASED — Buy + Skip */
                    <>
                        <TouchableOpacity
                            style={[styles.footerButton, styles.buyButton]}
                            onPress={handleBuyLead}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? <ActivityIndicator color={COLORS.white} />
                                : <><CheckCircle size={20} color={COLORS.white} /><Text style={styles.buyButtonText}>Buy Lead (30 Credits)</Text></>}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.footerButton, styles.skipButton]} onPress={handleSkip} disabled={isLoading}>
                            <XCircle size={20} color={COLORS.gray[700]} />
                            <Text style={styles.skipButtonText}>Skip</Text>
                        </TouchableOpacity>
                    </>
                ) : null}

            </View>

            {/* Status Update Modal */}
            <Modal
                visible={showUpdateModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowUpdateModal(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={() => setShowUpdateModal(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalIndicator} />
                        <Text style={styles.modalTitle}>Update Lead Status</Text>
                        <Text style={styles.modalSubtitle}>Please select the current status of this lead</Text>
                        
                        <View style={styles.optionsList}>
                            <TouchableOpacity 
                                style={styles.optionItem}
                                onPress={handleMarkAsConverted}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
                                    <CheckCircle size={20} color="#22C55E" />
                                </View>
                                <View style={styles.optionTextContainer}>
                                    <Text style={styles.optionLabel}>Delivery in progress</Text>
                                    <Text style={styles.optionDesc}>Customer has confirmed the purchase</Text>
                                </View>
                                <ChevronDown size={20} color={COLORS.gray[300]} style={{ transform: [{ rotate: '-90deg' }] }} />
                            </TouchableOpacity>

                            <View style={styles.optionDivider} />

                            <TouchableOpacity 
                                style={styles.optionItem}
                                onPress={handleMarkAsNotSold}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                                    <XCircle size={20} color="#EF4444" />
                                </View>
                                <View style={styles.optionTextContainer}>
                                    <Text style={styles.optionLabel}>Not sold</Text>
                                    <Text style={styles.optionDesc}>Customer was not interested or lead failed</Text>
                                </View>
                                <ChevronDown size={20} color={COLORS.gray[300]} style={{ transform: [{ rotate: '-90deg' }] }} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={() => setShowUpdateModal(false)}
                        >
                            <Text style={styles.cancelButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    modalIndicator: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.gray[200],
        borderRadius: 2,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: COLORS.gray[500],
        marginBottom: 24,
        textAlign: 'center',
    },
    optionsList: {
        width: '100%',
        backgroundColor: COLORS.gray[50],
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.gray[200],
        marginBottom: 24,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionTextContainer: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.black,
    },
    optionDesc: {
        fontSize: 12,
        color: COLORS.gray[500],
        marginTop: 2,
    },
    optionDivider: {
        height: 1,
        backgroundColor: COLORS.gray[200],
        marginHorizontal: 16,
    },
    cancelButton: {
        width: '100%',
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: COLORS.gray[100],
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.gray[700],
    },
    disabledOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
    },
});

