import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { QuestionnaireItem } from '../types';
import { Circle, List, AlignLeft } from 'lucide-react-native';

interface Props {
    data: QuestionnaireItem[];
}

export default function LeadQuestionnaireSummary({ data }: Props) {

    if (!data || data.length === 0) {
        return null;
    }

    const renderAnswer = (item: QuestionnaireItem) => {
        if (Array.isArray(item.answer)) {
            return (
                <View style={styles.tagContainer}>
                    {item.answer.map((val, idx) => (
                        <View key={idx} style={styles.tag}>
                            <Text style={styles.tagText}>{val}</Text>
                        </View>
                    ))}
                </View>
            );
        }
        return <Text style={styles.value}>{item.answer}</Text>;
    };

    const getIcon = (item: QuestionnaireItem) => {
        // We can do simple logic to pick distinct icons if we want, or just a generic one
        // For now, let's use a generic icon based on if it's a list or text
        if (Array.isArray(item.answer)) return <List size={18} color={COLORS.teal.main} />;
        return <AlignLeft size={18} color={COLORS.teal.main} />;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Customer Preferences</Text>

            {data.map((item, index) => (
                <View key={item.id} style={[
                    styles.section,
                    index === data.length - 1 && { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }
                ]}>
                    <View style={[styles.row, { alignItems: 'flex-start' }]}>
                        <View style={{ marginTop: 2 }}>{getIcon(item)}</View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>{item.question}</Text>
                            <View style={{ marginTop: 4 }}>
                                {renderAnswer(item)}
                            </View>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 16,
    },
    section: {
        paddingBottom: 12,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[100],
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    label: {
        fontSize: 12,
        color: COLORS.gray[500],
        marginBottom: 2,
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        color: COLORS.black,
        fontWeight: '600',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: COLORS.teal.lighter,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 12,
        color: COLORS.teal.dark,
        fontWeight: '600',
    },
});
