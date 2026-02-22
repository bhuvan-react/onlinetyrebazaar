import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import { X, Bell } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

interface NotificationsModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function NotificationsModal({ visible, onClose }: NotificationsModalProps) {
    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Notifications</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color={COLORS.black} size={24} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={[]}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.list}
                        renderItem={({ item }) => (
                            <View style={[styles.card, item.urgent && styles.urgentCard]}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text style={styles.cardTime}>{item.time}</Text>
                                </View>
                                <Text style={styles.cardMessage}>{item.message}</Text>
                            </View>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Bell size={48} color={COLORS.gray[300]} />
                                <Text style={styles.emptyText}>No new notifications</Text>
                            </View>
                        }
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        maxHeight: '70%',
        paddingVertical: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.black,
    },
    list: {
        paddingHorizontal: 20,
    },
    card: {
        padding: 16,
        backgroundColor: COLORS.gray[100],
        borderRadius: 12,
        marginBottom: 12,
    },
    urgentCard: {
        backgroundColor: '#FFF1F2', // Light red for urgency
        borderLeftWidth: 4,
        borderLeftColor: 'red',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    cardTitle: {
        fontWeight: '600',
        color: COLORS.gray[800],
        fontSize: 14,
    },
    cardTime: {
        fontSize: 12,
        color: COLORS.gray[500],
    },
    cardMessage: {
        fontSize: 14,
        color: COLORS.gray[600],
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        marginTop: 12,
        color: COLORS.gray[500],
    },
});
