import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Image,
    Modal,
    ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/theme';
import { ArrowLeft, User, Camera, ChevronDown, Check } from 'lucide-react-native';
import { getProfile, updateProfile } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const SERVICES = [
    'Tyre Sales', 'Wheel Alignment', 'Wheel Balancing', 'Tyre Rotation',
    'Puncture Repair', 'Nitrogen Filling', 'Tyre Fitting', 'Battery Service',
];

const BRANDS = [
    'MRF', 'CEAT', 'Apollo', 'JK Tyre', 'Bridgestone', 'Michelin',
    'Goodyear', 'Continental', 'Yokohama', 'Pirelli', 'Dunlop', 'TVS',
];

// Full Java DayOfWeek enum names required by backend
const WEEKDAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const WEEKDAY_LABELS: Record<string, string> = {
    MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed',
    THURSDAY: 'Thu', FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun',
};

export default function EditProfileScreen({ navigation }: Props) {
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        gstNumber: '',
        yearsInBusiness: '',
        mobile: '',
        email: '',
        whatsapp: '',
        shopNumber: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        openTime: '',
        closeTime: '',
        openDays: [] as string[],
        services: [] as string[],
        brands: [] as string[],
    });

    const [loading, setLoading] = useState(true);
    const [showStateDropdown, setShowStateDropdown] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const profile = await getProfile() as any;
            // Backend returns address as a flat string; put it in the street field
            const flatAddress = typeof profile.address === 'string' ? profile.address : '';
            setFormData({
                businessName: profile.businessName || '',
                ownerName: profile.ownerName || '',
                gstNumber: profile.gstNumber || '',
                yearsInBusiness: profile.yearsInBusiness || '',
                mobile: profile.mobile || '',
                email: profile.email || '',
                whatsapp: profile.whatsapp || '',
                shopNumber: '',
                street: flatAddress,
                city: '',
                state: '',
                pincode: '',
                landmark: '',
                openTime: profile.businessHours?.openTime || '',
                closeTime: profile.businessHours?.closeTime || '',
                openDays: profile.businessHours?.openDays || [],
                services: profile.services || [],
                brands: profile.brands || [],
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const toggleSelection = (field: 'services' | 'brands' | 'openDays', item: string) => {
        const list = formData[field];
        const newList = list.includes(item)
            ? list.filter((i) => i !== item)
            : [...list, item];
        handleInputChange(field, newList);
    };

    const handleSave = async () => {
        try {
            const payload = {
                businessName: formData.businessName,
                ownerName: formData.ownerName,
                mobile: formData.mobile,
                email: formData.email,
                address: {
                    street: [formData.shopNumber, formData.street].filter(Boolean).join(', '),
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                },
                businessHours: {
                    openTime: formData.openTime,
                    closeTime: formData.closeTime,
                    openDays: formData.openDays, // already full DayOfWeek enum values
                },
            };
            await updateProfile(payload);
            Alert.alert('Success', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.teal.main} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>

                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <User size={60} color={COLORS.white} />
                            <TouchableOpacity style={styles.cameraButton}>
                                <Camera size={16} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.changePhotoText}>Change Photo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Business Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Business Information</Text>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Business Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.businessName}
                                onChangeText={(t) => handleInputChange('businessName', t)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Owner Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.ownerName}
                                onChangeText={(t) => handleInputChange('ownerName', t)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>GST Number</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.gstNumber}
                                onChangeText={(t) => handleInputChange('gstNumber', t)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Years in Business</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.yearsInBusiness}
                                keyboardType="number-pad"
                                onChangeText={(t) => handleInputChange('yearsInBusiness', t)}
                            />
                        </View>
                    </View>

                    {/* Contact Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact Information</Text>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile Number (+91)</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.mobile}
                                keyboardType="phone-pad"
                                maxLength={10}
                                onChangeText={(t) => handleInputChange('mobile', t)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.email}
                                keyboardType="email-address"
                                onChangeText={(t) => handleInputChange('email', t)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>WhatsApp Number</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.whatsapp}
                                keyboardType="phone-pad"
                                maxLength={10}
                                onChangeText={(t) => handleInputChange('whatsapp', t)}
                            />
                        </View>
                    </View>

                    {/* Shop Address */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Shop Address</Text>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Shop No. / Building</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.shopNumber}
                                onChangeText={(t) => handleInputChange('shopNumber', t)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Street / Area</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.street}
                                onChangeText={(t) => handleInputChange('street', t)}
                            />
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>City</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.city}
                                    onChangeText={(t) => handleInputChange('city', t)}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Pincode</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.pincode}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    onChangeText={(t) => handleInputChange('pincode', t)}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>State</Text>
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setShowStateDropdown(!showStateDropdown)}
                            >
                                <Text style={styles.dropdownText}>{formData.state}</Text>
                                <ChevronDown size={16} color={COLORS.gray[600]} />
                            </TouchableOpacity>

                            {showStateDropdown && (
                                <View style={styles.dropdownList}>
                                    <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                                        {INDIAN_STATES.map((state) => (
                                            <TouchableOpacity
                                                key={state}
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    handleInputChange('state', state);
                                                    setShowStateDropdown(false);
                                                }}
                                            >
                                                <Text style={styles.dropdownItemText}>{state}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Landmark (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.landmark}
                                onChangeText={(t) => handleInputChange('landmark', t)}
                            />
                        </View>
                    </View>

                    {/* Business Hours */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Business Hours</Text>
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Open Time</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.openTime}
                                    placeholder="09:00 AM"
                                    onChangeText={(t) => handleInputChange('openTime', t)}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Close Time</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.closeTime}
                                    placeholder="08:00 PM"
                                    onChangeText={(t) => handleInputChange('closeTime', t)}
                                />
                            </View>
                        </View>
                        <Text style={[styles.label, { marginTop: 8 }]}>Open Days</Text>
                        <View style={styles.daysGrid}>
                            {WEEKDAYS.map((day) => (
                                <TouchableOpacity
                                    key={day}
                                    style={[
                                        styles.dayChip,
                                        formData.openDays.includes(day) && styles.dayChipActive
                                    ]}
                                    onPress={() => toggleSelection('openDays', day)}
                                >
                                    <Text style={[
                                        styles.dayText,
                                        formData.openDays.includes(day) && styles.dayTextActive
                                    ]}>{WEEKDAY_LABELS[day]}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Services */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Services Offered</Text>
                        <View style={styles.checkboxGrid}>
                            {SERVICES.map((service) => (
                                <TouchableOpacity
                                    key={service}
                                    style={styles.checkboxItem}
                                    onPress={() => toggleSelection('services', service)}
                                >
                                    <View style={[
                                        styles.checkbox,
                                        formData.services.includes(service) && styles.checkboxChecked
                                    ]}>
                                        {formData.services.includes(service) && <Check size={14} color={COLORS.white} />}
                                    </View>
                                    <Text style={styles.checkboxLabel}>{service}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Brands */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Brands Available</Text>
                        <View style={styles.checkboxGrid}>
                            {BRANDS.map((brand) => (
                                <TouchableOpacity
                                    key={brand}
                                    style={styles.checkboxItem}
                                    onPress={() => toggleSelection('brands', brand)}
                                >
                                    <View style={[
                                        styles.checkbox,
                                        formData.brands.includes(brand) && styles.checkboxChecked
                                    ]}>
                                        {formData.brands.includes(brand) && <Check size={14} color={COLORS.white} />}
                                    </View>
                                    <Text style={styles.checkboxLabel}>{brand}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                </ScrollView>
            )}

            {/* Bottom Actions */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[50],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: COLORS.white,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.black,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.teal.main,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        position: 'relative',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.teal.dark,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    changePhotoText: {
        color: COLORS.teal.main,
        fontWeight: '600',
        fontSize: 14,
    },
    section: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.teal.dark,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[100],
        paddingBottom: 8,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.gray[700],
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: COLORS.black,
        backgroundColor: COLORS.gray[50],
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: COLORS.gray[50],
    },
    dropdownText: {
        fontSize: 15,
        color: COLORS.black,
    },
    dropdownList: {
        marginTop: 4,
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 8,
        backgroundColor: COLORS.white,
        zIndex: 10,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[100],
    },
    dropdownItemText: {
        fontSize: 15,
        color: COLORS.black,
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    dayChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.gray[100],
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    dayChipActive: {
        backgroundColor: COLORS.teal.main,
        borderColor: COLORS.teal.main,
    },
    dayText: {
        fontSize: 13,
        color: COLORS.gray[600],
    },
    dayTextActive: {
        color: COLORS.white,
        fontWeight: '600',
    },
    checkboxGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%', // 2 columns roughly
        marginBottom: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: COLORS.gray[300],
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: COLORS.teal.main,
        borderColor: COLORS.teal.main,
    },
    checkboxLabel: {
        fontSize: 14,
        color: COLORS.gray[700],
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        padding: 16,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[200],
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.gray[700],
    },
    saveButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        backgroundColor: COLORS.teal.main,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
