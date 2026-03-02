import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Calendar, ArrowRight, Clock } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

interface LeadCardProps {
    name: string;
    vehicle: string;
    tyreSize?: string;
    tyreBrand?: string;
    tyreType?: string;
    location: string;
    date: string;
    status: 'New' | 'Fresh' | 'Follow-up' | 'Converted' | 'Skipped' | string;
    /** When true: card is greyed out and tapping it is blocked at screen level */
    isOverdue?: boolean;
    onPress: () => void;
}

export default function LeadCard({ name, vehicle, tyreSize, tyreBrand, tyreType, location, date, status, isOverdue = false, onPress }: LeadCardProps) {
    // Derive tyre type display — defaults to New if no type set
    const isNew = !tyreType || tyreType.toUpperCase() === 'NEW';
    const tyreTypeColor = isNew ? COLORS.teal.main : '#9333EA';
    const tyreTypeLabel = isNew ? 'New' : 'Used';

    return (
        <TouchableOpacity
            style={[styles.card, isOverdue && styles.cardOverdue]}
            onPress={onPress}
            activeOpacity={isOverdue ? 1 : 0.8}
        >
            {/* Overdue badge — shown at the top of the card */}
            {isOverdue && (
                <View style={styles.overdueBanner}>
                    <Clock size={13} color="#fff" />
                    <Text style={styles.overdueBannerText}>⏰ Overdue – Update Status</Text>
                </View>
            )}

            <View style={styles.header}>
                {/* Left: Name, vehicle, tyre size */}
                <View style={styles.headerLeft}>
                    <Text style={[styles.name, isOverdue && styles.textMuted]}>{name}</Text>
                    <Text style={[styles.vehicle, isOverdue && styles.textMuted]}>{vehicle}</Text>
                    {tyreBrand && <Text style={[styles.tyreSize, { color: isOverdue ? COLORS.gray[400] : COLORS.teal.dark, fontWeight: '600' }]}>{tyreBrand}</Text>}
                    {tyreSize && <Text style={[styles.tyreSize, isOverdue && styles.textMuted]}>{tyreSize}</Text>}
                </View>
                {/* Right: New / Used badge replacing VERIFIED */}
                <View style={[styles.typeBadge, { backgroundColor: isOverdue ? COLORS.gray[300] : tyreTypeColor }]}>
                    <Text style={styles.badgeText}>{tyreTypeLabel}</Text>
                </View>
            </View>

            <View style={styles.details}>
                <View style={styles.row}>
                    <MapPin size={14} color={isOverdue ? COLORS.gray[300] : COLORS.gray[500]} />
                    <Text style={[styles.detailText, isOverdue && styles.textMuted]}>{location}</Text>
                </View>
                <View style={styles.row}>
                    <Calendar size={14} color={isOverdue ? COLORS.gray[300] : COLORS.gray[500]} />
                    <Text style={[styles.detailText, isOverdue && styles.textMuted]}>{date}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.viewButton, { backgroundColor: isOverdue ? COLORS.gray[300] : tyreTypeColor }]}
                    onPress={onPress}
                    disabled={isOverdue}
                >
                    <Text style={styles.viewText}>{isOverdue ? 'Status Update Required' : 'View Details'}</Text>
                    {!isOverdue && <ArrowRight size={16} color={COLORS.white} />}
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Elevation for Android
        elevation: 3,
    },
    cardOverdue: {
        backgroundColor: '#F9FAFB',          // very light grey background
        borderColor: '#E5E7EB',
        opacity: 0.75,
        shadowOpacity: 0,
        elevation: 0,
    },
    overdueBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#EF4444',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 5,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    overdueBannerText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    textMuted: {
        color: COLORS.gray[400],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerLeft: {
        flex: 1,
        marginRight: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 4,
    },
    vehicle: {
        fontSize: 14,
        color: COLORS.black,
        fontWeight: '500',
    },
    tyreSize: {
        fontSize: 13,
        color: COLORS.gray[600],
        marginTop: 2,
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    details: {
        marginBottom: 16,
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 13,
        color: COLORS.gray[500],
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[100],
        paddingTop: 12,
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    viewText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 13,
    },
});
