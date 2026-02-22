import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, LogOut, Settings, HelpCircle, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

interface SidebarModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function SidebarModal({ visible, onClose }: SidebarModalProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleLogout = () => {
        onClose();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Menu</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color={COLORS.black} size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <TouchableOpacity style={styles.item} onPress={() => { onClose(); navigation.navigate('MainTabs', { screen: 'Settings' }); }}>
                            <View style={styles.itemLeft}>
                                <Settings size={20} color={COLORS.gray[700]} />
                                <Text style={styles.itemText}>Settings</Text>
                            </View>
                            <ChevronRight size={20} color={COLORS.gray[400]} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.item} onPress={() => { onClose(); }}>
                            <View style={styles.itemLeft}>
                                <HelpCircle size={20} color={COLORS.gray[700]} />
                                <Text style={styles.itemText}>Help & Support</Text>
                            </View>
                            <ChevronRight size={20} color={COLORS.gray[400]} />
                        </TouchableOpacity>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <LogOut size={20} color={COLORS.teal.main} />
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.backdrop} onPress={onClose} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'row',
    },
    container: {
        width: '80%',
        backgroundColor: COLORS.white,
        height: '100%',
        paddingTop: 50, // safe area
    },
    backdrop: {
        width: '20%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.teal.dark,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[100],
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    itemText: {
        fontSize: 16,
        color: COLORS.gray[800],
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[200],
        paddingBottom: 40,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoutText: {
        fontSize: 16,
        color: COLORS.teal.main,
        fontWeight: '600',
    },
});
