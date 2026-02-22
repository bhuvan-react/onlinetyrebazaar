import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Menu, Bell, User } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';

interface CustomHeaderProps {
    title: string;
    onMenuPress: () => void;
    onNotificationPress: () => void;
    onProfilePress: () => void;
}

export default function CustomHeader({
    title,
    onMenuPress,
    onNotificationPress,
    onProfilePress,
}: CustomHeaderProps) {
    return (
        <View style={styles.container}>
            {/* Left: Menu & Title */}
            <View style={styles.leftSection}>
                <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
                    <Menu color={COLORS.black} size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
            </View>

            {/* Right: Actions */}
            <View style={styles.rightSection}>
                <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
                    <Bell color={COLORS.black} size={24} />
                    <View style={styles.badge} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onProfilePress} style={[styles.iconButton, styles.profileButton]}>
                    <User color={COLORS.white} size={20} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
        paddingTop: 50, // basic safe area adjustment
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.black,
        marginLeft: 12,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
        borderWidth: 1,
        borderColor: COLORS.white,
    },
    profileButton: {
        backgroundColor: COLORS.teal.main,
        borderRadius: 20,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
