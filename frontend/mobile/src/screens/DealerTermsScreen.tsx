import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'DealerTerms'>;

export default function DealerTermsScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft size={22} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms & Conditions</Text>
                <View style={{ width: 38 }} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.agreementTitle}>Dealer Lead Supply Agreement</Text>
                <Text style={styles.agreementSubtitle}>
                    OnlineTyreBazaar — Dealer Partner Terms
                </Text>

                <Section number="1" title="Purpose">
                    OnlineTyreBazaar generates and supplies prospective customer leads. Dealer agrees to purchase and use such leads strictly as per these terms.
                </Section>

                <Section number="2" title="Scope of Services">
                    Leads may include customer name, contact number, location, vehicle details, and enquiry intent. Leads may be shared via CRM, dashboard, WhatsApp, email, or API. No guarantee of conversion or revenue is provided.
                </Section>

                <Section number="3" title="Non-Exclusivity">
                    Leads are strictly non-exclusive. Company may allocate the same or similar leads to multiple dealers.
                </Section>

                <Section number="4" title="Pricing, Wallet & Payments">
                    Lead pricing is dynamic and displayed in real time. Displayed price is final and binding. Dealer must maintain prepaid wallet balance. Auto-debit applies. No refunds or chargebacks are permitted. Applicable taxes will be charged additionally.
                </Section>

                <Section number="5" title="Dealer Obligations">
                    Dealer shall use leads only for genuine sales follow-up, comply with all applicable laws including IT Act, Consumer Protection Act, DND regulations, and Digital Personal Data Protection Act, 2023. Dealer shall not resell, misuse, or transfer leads.
                </Section>

                <Section number="6" title="Rating, Suspension & Blacklisting">
                    Company may monitor performance, assign ratings, suspend, downgrade, deactivate, or permanently blacklist dealers for misuse, fraud, chargeback attempts, poor performance, or reputational harm.
                </Section>

                <Section number="7" title="Confidentiality">
                    Dealer must maintain strict confidentiality of all business, pricing, technical, and customer data.
                </Section>

                <Section number="8" title="Intellectual Property">
                    All platform software, branding, systems, and processes remain exclusive property of the Company.
                </Section>

                <Section number="9" title="Data Protection">
                    Customer personal data must be processed strictly for enquiry purposes. Dealer must implement safeguards and delete data upon completion of purpose or termination. Dealer is solely liable for any data misuse or regulatory action.
                </Section>

                <Section number="10" title="Term & Termination">
                    Agreement remains valid unless terminated. Either party may terminate with 30 days' notice. Company may terminate immediately for breach, misuse, or payment default. Upon termination, Dealer must cease use of all leads and delete data.
                </Section>

                <Section number="11" title="Limitation of Liability">
                    Company acts only as technology intermediary. Company is not liable for customer disputes, losses, damages, or revenue impact. All transactions are solely between Dealer and Customer.
                </Section>

                <Section number="12" title="Indemnity">
                    Dealer agrees to indemnify and hold harmless the Company against any claims, penalties, losses, or legal expenses arising from misuse of leads or breach of law.
                </Section>

                <Section number="13" title="Governing Law & Arbitration">
                    Governed by laws of India. Disputes shall be resolved by arbitration under Arbitration and Conciliation Act, 1996. Seat and venue: Hyderabad, Telangana.
                </Section>

                <Section number="14" title="Digital Acceptance">
                    Acceptance through app, OTP, or clicking "I Agree" constitutes legally binding execution. Dealer waives objections regarding electronic acceptance.
                </Section>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By checking "I accept the Terms and Conditions" on the registration screen, you are agreeing to all of the above terms.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function Section({
    number,
    title,
    children,
}: {
    number: string;
    title: string;
    children: string;
}) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>
                {number}. {title}
            </Text>
            <Text style={styles.sectionBody}>{children}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
        backgroundColor: COLORS.white,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.black,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    agreementTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.teal.dark,
        marginBottom: 4,
    },
    agreementSubtitle: {
        fontSize: 13,
        color: COLORS.gray[500],
        marginBottom: 24,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 6,
    },
    sectionBody: {
        fontSize: 14,
        lineHeight: 22,
        color: COLORS.gray[600],
    },
    footer: {
        marginTop: 24,
        padding: 16,
        backgroundColor: COLORS.teal.lighter,
        borderRadius: 10,
    },
    footerText: {
        fontSize: 13,
        lineHeight: 20,
        color: COLORS.teal.dark,
        fontStyle: 'italic',
    },
});
