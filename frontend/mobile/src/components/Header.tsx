import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeaderProps } from '../types';
import { COLORS } from '../constants/theme';

export default function Header({ subtitle }: HeaderProps) {
    return (
        <View style={styles.container}>
            {/* TyrePlus Logo */}
            <View style={styles.logoContainer}>
                {/* <Text style={styles.logoEmoji}>🔴</Text> */}
                <Text style={styles.logoText}> {``} TyrePlus</Text>
            </View>

            {/* Subtitle */}
            {/* <Text style={styles.subtitle}>{subtitle}</Text> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    logoEmoji: {
        fontSize: 36,
        marginRight: 8,
    },
    logoText: {
        fontSize: 30,
        fontWeight: '700',
        color: COLORS.teal.main,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.gray[600],
    },
});
