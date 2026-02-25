import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Calendar, ArrowRight } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

interface LeadCardProps {
    name: string;
    vehicle: string;
    tyreSize?: string;
    tyreType?: string;
    location: string;
    date: string;
    status: 'New' | 'Follow-up' | 'Converted';
    onPress: () => void;
}

export default function LeadCard({ name, vehicle, tyreSize, tyreType, location, date, status, onPress }: LeadCardProps) {
    // Derive tyre type display — defaults to New if no type set
    const isNew = !tyreType || tyreType.toUpperCase() === 'NEW';
    const tyreTypeColor = isNew ? COLORS.teal.main : '#9333EA';
    const tyreTypeLabel = isNew ? 'New' : 'Used';

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                {/* Left: Name, vehicle, tyre size */}
                <View style={styles.headerLeft}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.vehicle}>{vehicle}</Text>
                    {tyreSize && <Text style={styles.tyreSize}>{tyreSize}</Text>}
                </View>
                {/* Right: New / Used badge replacing VERIFIED */}
                <View style={[styles.typeBadge, { backgroundColor: tyreTypeColor }]}>
                    <Text style={styles.badgeText}>{tyreTypeLabel}</Text>
                </View>
            </View>

            <View style={styles.details}>
                <View style={styles.row}>
                    <MapPin size={14} color={COLORS.gray[500]} />
                    <Text style={styles.detailText}>{location}</Text>
                </View>
                <View style={styles.row}>
                    <Calendar size={14} color={COLORS.gray[500]} />
                    <Text style={styles.detailText}>{date}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                {/* View Details button — Teal for New, Purple for Used */}
                <TouchableOpacity
                    style={[styles.viewButton, { backgroundColor: tyreTypeColor }]}
                    onPress={onPress}
                >
                    <Text style={styles.viewText}>View Details</Text>
                    <ArrowRight size={16} color={COLORS.white} />
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
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: COLORS.teal.light,
        borderRadius: 8,
    },
    callText: {
        color: COLORS.teal.dark,
        fontWeight: '600',
        fontSize: 13,
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
