import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { X, User, Phone, Mail, MapPin } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { getProfile } from '../services/api';

interface ProfileModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function ProfileModal({ visible, onClose }: ProfileModalProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [profile, setProfile] = React.useState<any>(null);

    React.useEffect(() => {
        if (visible) {
            loadProfile();
        }
    }, [visible]);

    const loadProfile = async () => {
        try {
            const data = await getProfile();
            setProfile(data);
        } catch (error) {
            console.log('Failed to load profile');
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>My Profile</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color={COLORS.black} size={24} />
                        </TouchableOpacity>
                    </View>

                    {profile ? (
                        <>
                            <View style={styles.profileHeader}>
                                <View style={styles.avatar}>
                                    <User size={40} color={COLORS.white} />
                                </View>
                                <Text style={styles.name}>{profile.businessName}</Text>
                                <Text style={styles.role}>{profile.isVerified ? 'Verified Dealer' : 'Dealer'}</Text>
                            </View>

                            <View style={styles.details}>
                                <View style={styles.row}>
                                    <Phone size={20} color={COLORS.teal.main} />
                                    <Text style={styles.text}>{profile.mobile}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Mail size={20} color={COLORS.teal.main} />
                                    <Text style={styles.text}>{profile.email}</Text>
                                </View>
                                <View style={styles.row}>
                                    <MapPin size={20} color={COLORS.teal.main} />
                                    <Text style={styles.text}>
                                        {profile.address ? `${profile.address.shopNumber}, ${profile.address.street}, ${profile.address.city}` : 'Address not set'}
                                    </Text>
                                </View>
                            </View>
                        </>
                    ) : (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text>Loading...</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => {
                            onClose();
                            navigation.navigate('EditProfile');
                        }}
                    >
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>

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
        padding: 20,
    },
    container: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.black,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.teal.main,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.black,
    },
    role: {
        fontSize: 14,
        color: COLORS.teal.main,
        fontWeight: '600',
    },
    details: {
        gap: 16,
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    text: {
        fontSize: 16,
        color: COLORS.gray[700],
    },
    editButton: {
        backgroundColor: COLORS.teal.light,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        color: COLORS.teal.dark,
        fontWeight: '600',
        fontSize: 16,
    },
});
