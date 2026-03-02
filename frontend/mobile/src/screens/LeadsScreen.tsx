import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList, Modal } from 'react-native';
import { COLORS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, BottomTabParamList } from '../types';
import { Filter, ChevronDown, AlertCircle, X } from 'lucide-react-native';
import LeadCard from '../components/LeadCard';
import { getLeads, getUnlockedLeads } from '../services/api';
import { isLeadOverdue } from '../utils/leadOverdue';

const FILTERS = ['All', 'Fresh', 'Follow-up', 'Converted', 'Skipped'];
const SORT_OPTIONS = ['Date (Newest)', 'Date (Oldest)', 'Priority'];

export default function LeadsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<BottomTabParamList, 'Leads'>>();
    const [activeFilter, setActiveFilter] = useState('All');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [sortBy, setSortBy] = useState('Date (Newest)');

    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Popup: shown once per session when any follow-up lead is overdue
    const [showOverduePopup, setShowOverduePopup] = useState(false);
    const overduePopupShownRef = useRef(false);

    useFocusEffect(
        useCallback(() => {
            if (route.params?.filter) {
                console.log('Setting filter from params:', route.params.filter);
                setActiveFilter(route.params.filter);
                navigation.setParams({ filter: undefined });
            }
        }, [route.params])
    );

    useFocusEffect(
        useCallback(() => {
            loadLeads();
        }, [activeFilter, sortBy])
    );

    const loadLeads = async () => {
        setLoading(true);
        setLeads([]); // Clear immediately so stale data never shows during refresh
        try {
            let data;
            if (activeFilter === 'Follow-up') {
                data = await getUnlockedLeads('Follow-up');
            } else if (activeFilter === 'Converted') {
                data = await getUnlockedLeads('CONVERTED');
            } else {
                data = await getLeads(activeFilter, sortBy);
            }

            // Handle paginated response structure or direct array
            let leadsData = [];
            if (data && (data as any).content) {
                leadsData = (data as any).content;
            } else if (Array.isArray(data)) {
                leadsData = data;
            }

            setLeads(leadsData);

            // Check for overdue leads in Follow-up tab — show popup once per session
            if (activeFilter === 'Follow-up' && !overduePopupShownRef.current) {
                const hasOverdue = leadsData.some(isLeadOverdue);
                if (hasOverdue) {
                    setShowOverduePopup(true);
                    overduePopupShownRef.current = true;
                }
            }
        } catch (error) {
            console.log('Failed to load leads');
            setLeads([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLeadPress = (id: string, overdue: boolean) => {
        if (overdue) {
            Alert.alert(
                '⏰ Update Required',
                'Please update the lead status before viewing details.',
            );
            return;
        }
        navigation.navigate('LeadDetails', { leadId: id });
    };

    return (
        <View style={styles.container}>
            {/* 48-hour overdue reminder popup */}
            <Modal
                visible={showOverduePopup}
                transparent
                animationType="fade"
                onRequestClose={() => setShowOverduePopup(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <AlertCircle size={28} color="#EF4444" />
                            <Text style={styles.modalTitle}>Leads Overdue for Update</Text>
                        </View>
                        <Text style={styles.modalBody}>
                            You have one or more leads that haven't been updated in over{' '}
                            <Text style={styles.modalHighlight}>48 hours</Text>. These leads are
                            greyed out until you update their status.
                        </Text>
                        <Text style={styles.modalSub}>
                            Please mark each lead as "Delivery in Progress" or "Not Sold" to
                            continue.
                        </Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowOverduePopup(false)}
                        >
                            <Text style={styles.modalButtonText}>Got it</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Filter & Sort Header */}
            <View style={styles.header}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
                    {FILTERS.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity style={styles.sortButton} onPress={() => setShowSortDropdown(!showSortDropdown)}>
                    <Text style={styles.sortText}>{sortBy}</Text>
                    <ChevronDown size={16} color={COLORS.gray[600]} />
                </TouchableOpacity>
            </View>

            {/* Sort Dropdown Overlay */}
            {showSortDropdown && (
                <View style={styles.dropdownContainer}>
                    {SORT_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={styles.dropdownItem}
                            onPress={() => {
                                setSortBy(option);
                                setShowSortDropdown(false);
                            }}
                        >
                            <Text style={[styles.dropdownText, sortBy === option && styles.dropdownTextActive]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Leads List */}
            <FlatList
                data={leads}
                refreshing={loading}
                onRefresh={loadLeads}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => {
                    const overdue = isLeadOverdue(item);
                    return (
                        <LeadCard
                            name={item.customerName}
                            vehicle={`${item.vehicleModel}${item.vehicleYear ? ' ' + item.vehicleYear : ''}`}
                            tyreSize={item.tyreSize || (item.tyreInfo ? item.tyreInfo.size : undefined)}
                            tyreType={item.tyreType}
                            location={`${item.locationArea || ''} ${item.locationPincode || ''}`.trim() || 'N/A'}
                            date={new Date(item.createdAt).toLocaleDateString()}
                            status={item.status === 'NEW' ? 'New' : item.status === 'FOLLOW_UP' ? 'Follow-up' : item.status === 'CONVERTED' ? 'Converted' : item.status}
                            isOverdue={overdue}
                            onPress={() => handleLeadPress(item.id, overdue)}
                        />
                    );
                }}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No leads found</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'column',
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    filterScroll: {
        marginBottom: 12,
    },
    filterContainer: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.gray[100],
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    filterChipActive: {
        backgroundColor: COLORS.teal.main,
        borderColor: COLORS.teal.main,
    },
    filterText: {
        fontSize: 14,
        color: COLORS.gray[600],
        fontWeight: '500',
    },
    filterTextActive: {
        color: COLORS.white,
        fontWeight: '600',
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: 16,
        gap: 4,
    },
    sortText: {
        fontSize: 14,
        color: COLORS.gray[600],
        fontWeight: '500',
    },
    dropdownContainer: {
        position: 'absolute',
        top: 90,
        right: 16,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
        zIndex: 100,
        width: 150,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[100],
    },
    dropdownText: {
        fontSize: 14,
        color: COLORS.gray[700],
    },
    dropdownTextActive: {
        color: COLORS.teal.main,
        fontWeight: '600',
    },
    list: {
        padding: 16,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: COLORS.gray[500],
        fontSize: 16,
    },
    // Overdue popup modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 24,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    modalBody: {
        fontSize: 14,
        color: COLORS.gray[700],
        lineHeight: 21,
        marginBottom: 10,
    },
    modalHighlight: {
        fontWeight: '700',
        color: '#EF4444',
    },
    modalSub: {
        fontSize: 13,
        color: COLORS.gray[500],
        lineHeight: 19,
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: COLORS.teal.main,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    modalButtonText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 15,
    },
});
