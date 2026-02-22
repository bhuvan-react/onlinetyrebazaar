import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, FullDealerFormData } from '../types';
import Header from '../components/Header';
import OTPModal from '../components/OTPModal';
import { COLORS } from '../constants/theme';
import { registerDealer, sendOtp } from '../services/api';

type FullDealerRegisterScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'FullDealerRegister'
>;

interface Props {
    navigation: FullDealerRegisterScreenNavigationProp;
}

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

export default function FullDealerRegisterScreen({ navigation }: Props) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FullDealerFormData>({
        businessName: '',
        ownerName: '',
        mobile: '',
        email: '',
        password: '',
        gstNumber: '',
        yearsInBusiness: '',
        shopAddress: '',
        city: '',
        state: '',
        pincode: '',
        services: [],
        brands: [],
        termsAccepted: false,
    });
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [showStateDropdown, setShowStateDropdown] = useState(false);

    const handleInputChange = (field: keyof FullDealerFormData, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const toggleService = (service: string) => {
        const services = formData.services.includes(service)
            ? formData.services.filter((s) => s !== service)
            : [...formData.services, service];
        handleInputChange('services', services);
    };

    const toggleBrand = (brand: string) => {
        const brands = formData.brands.includes(brand)
            ? formData.brands.filter((b) => b !== brand)
            : [...formData.brands, brand];
        handleInputChange('brands', brands);
    };

    const validateStep1 = () => {
        if (!formData.businessName || !formData.ownerName || !formData.mobile || !formData.email || !formData.password) {
            Alert.alert('Error', 'Please fill all required fields');
            return false;
        }
        if (formData.mobile.length !== 10) {
            Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.shopAddress || !formData.city || !formData.state || !formData.pincode) {
            Alert.alert('Error', 'Please fill all required fields');
            return false;
        }
        if (formData.pincode.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit pincode');
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        if (formData.services.length === 0) {
            Alert.alert('Error', 'Please select at least one service');
            return false;
        }
        if (formData.brands.length === 0) {
            Alert.alert('Error', 'Please select at least one brand');
            return false;
        }
        if (!formData.termsAccepted) {
            Alert.alert('Error', 'Please accept the terms and conditions');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        if (validateStep3()) {
            try {
                await sendOtp(formData.mobile);
                setOtpModalVisible(true);
            } catch (error) {
                Alert.alert('Error', 'Failed to send OTP. Please check your network and mobile number.');
            }
        }
    };

    const handleOtpVerify = async (otp: string) => {
        try {
            // Transform flat formData into the shape backend RegisterRequest expects
            const payload = {
                businessName: formData.businessName,
                ownerName: formData.ownerName,
                mobile: formData.mobile,
                email: formData.email,
                otp,
                password: formData.password,
                address: {
                    street: formData.shopAddress,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                },
                businessHours: {
                    openTime: '09:00',
                    closeTime: '18:00',
                    // Java DayOfWeek enum values (MONDAY, TUESDAY, …)
                    openDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
                },
            };
            await registerDealer(payload);
            setOtpModalVisible(false);
            Alert.alert(
                'Success',
                'Registration successful! Your application is under review.',
                [{ text: 'OK', onPress: () => navigation.replace('MainTabs', { screen: 'Dashboard' }) }]
            );
        } catch (error) {
            Alert.alert('Error', 'Registration failed. Please try again.');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Header subtitle="Dealer Registration" />

            {/* Title */}
            <Text style={styles.title}>🏪 REGISTER YOUR BUSINESS</Text>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
                {[1, 2, 3].map((step) => (
                    <View key={step} style={styles.progressItem}>
                        <View
                            style={[
                                styles.progressCircle,
                                currentStep >= step && styles.progressCircleActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.progressNumber,
                                    currentStep >= step && styles.progressNumberActive,
                                ]}
                            >
                                {step}
                            </Text>
                        </View>
                        {step < 3 && (
                            <View
                                style={[
                                    styles.progressLine,
                                    currentStep > step && styles.progressLineActive,
                                ]}
                            />
                        )}
                    </View>
                ))}
            </View>

            {/* Step Labels */}
            <View style={styles.stepLabelsContainer}>
                <Text style={[styles.stepLabel, currentStep === 1 && styles.stepLabelActive]}>
                    Business Info
                </Text>
                <Text style={[styles.stepLabel, currentStep === 2 && styles.stepLabelActive]}>
                    Shop Details
                </Text>
                <Text style={[styles.stepLabel, currentStep === 3 && styles.stepLabelActive]}>
                    Services & Brands
                </Text>
            </View>

            {/* Step 1: Business Info */}
            {currentStep === 1 && (
                <View style={styles.formSection}>
                    <Text style={styles.label}>Business Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter business name"
                        value={formData.businessName}
                        onChangeText={(value) => handleInputChange('businessName', value)}
                    />

                    <Text style={styles.label}>Owner Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter owner name"
                        value={formData.ownerName}
                        onChangeText={(value) => handleInputChange('ownerName', value)}
                    />

                    <Text style={styles.label}>Mobile Number *</Text>
                    <View style={styles.mobileInputContainer}>
                        <Text style={styles.prefix}>+91</Text>
                        <TextInput
                            style={styles.mobileInput}
                            placeholder="Enter 10-digit mobile"
                            keyboardType="phone-pad"
                            maxLength={10}
                            value={formData.mobile}
                            onChangeText={(value) => handleInputChange('mobile', value)}
                        />
                    </View>

                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter email address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                    />

                    <Text style={styles.label}>Password *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter password"
                        secureTextEntry
                        value={formData.password}
                        onChangeText={(value) => handleInputChange('password', value)}
                    />

                    <Text style={styles.label}>GST Number (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter GST number"
                        autoCapitalize="characters"
                        value={formData.gstNumber}
                        onChangeText={(value) => handleInputChange('gstNumber', value)}
                    />

                    <Text style={styles.label}>Years in Business (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter years"
                        keyboardType="number-pad"
                        value={formData.yearsInBusiness}
                        onChangeText={(value) => handleInputChange('yearsInBusiness', value)}
                    />
                </View>
            )}

            {/* Step 2: Shop Details */}
            {currentStep === 2 && (
                <View style={styles.formSection}>
                    <Text style={styles.label}>Shop Address *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter complete shop address"
                        multiline
                        numberOfLines={3}
                        value={formData.shopAddress}
                        onChangeText={(value) => handleInputChange('shopAddress', value)}
                    />

                    <Text style={styles.label}>City *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter city"
                        value={formData.city}
                        onChangeText={(value) => handleInputChange('city', value)}
                    />

                    <Text style={styles.label}>State *</Text>
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setShowStateDropdown(!showStateDropdown)}
                    >
                        <Text style={formData.state ? styles.dropdownText : styles.dropdownPlaceholder}>
                            {formData.state || 'Select state'}
                        </Text>
                        <Text style={styles.dropdownArrow}>{showStateDropdown ? '▲' : '▼'}</Text>
                    </TouchableOpacity>

                    {showStateDropdown && (
                        <View style={styles.dropdownList}>
                            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
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

                    <Text style={styles.label}>Pincode *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter 6-digit pincode"
                        keyboardType="number-pad"
                        maxLength={6}
                        value={formData.pincode}
                        onChangeText={(value) => handleInputChange('pincode', value)}
                    />
                </View>
            )}

            {/* Step 3: Services & Brands */}
            {currentStep === 3 && (
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Services Offered *</Text>
                    <View style={styles.checkboxGrid}>
                        {SERVICES.map((service) => (
                            <TouchableOpacity
                                key={service}
                                style={styles.checkboxItem}
                                onPress={() => toggleService(service)}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        formData.services.includes(service) && styles.checkboxChecked,
                                    ]}
                                >
                                    {formData.services.includes(service) && (
                                        <Text style={styles.checkboxIcon}>✓</Text>
                                    )}
                                </View>
                                <Text style={styles.checkboxLabel}>{service}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Brands Dealt *</Text>
                    <View style={styles.checkboxGrid}>
                        {BRANDS.map((brand) => (
                            <TouchableOpacity
                                key={brand}
                                style={styles.checkboxItem}
                                onPress={() => toggleBrand(brand)}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        formData.brands.includes(brand) && styles.checkboxChecked,
                                    ]}
                                >
                                    {formData.brands.includes(brand) && (
                                        <Text style={styles.checkboxIcon}>✓</Text>
                                    )}
                                </View>
                                <Text style={styles.checkboxLabel}>{brand}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Documents (Optional)</Text>
                    <TouchableOpacity style={styles.uploadButton}>
                        <Text style={styles.uploadButtonText}>📄 Upload GST Certificate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.uploadButton}>
                        <Text style={styles.uploadButtonText}>📄 Upload Shop License</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.termsContainer}
                        onPress={() => handleInputChange('termsAccepted', !formData.termsAccepted)}
                    >
                        <View
                            style={[
                                styles.checkbox,
                                formData.termsAccepted && styles.checkboxChecked,
                            ]}
                        >
                            {formData.termsAccepted && <Text style={styles.checkboxIcon}>✓</Text>}
                        </View>
                        <Text style={styles.termsText}>
                            I accept the terms and conditions *
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Benefits Section */}
            <View style={styles.benefitsBox}>
                <Text style={styles.benefitsTitle}>Why Join TyrePlus?</Text>
                <Text style={styles.benefitText}>✓ Increased visibility to customers</Text>
                <Text style={styles.benefitText}>✓ Digital tools for business management</Text>
                <Text style={styles.benefitText}>✓ Marketing support</Text>
                <Text style={styles.benefitText}>✓ Dedicated partner support</Text>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                {currentStep > 1 && (
                    <TouchableOpacity style={styles.secondaryButton} onPress={handlePrevious}>
                        <Text style={styles.secondaryButtonText}>Previous</Text>
                    </TouchableOpacity>
                )}

                {currentStep < 3 ? (
                    <TouchableOpacity
                        style={[styles.primaryButton, currentStep === 1 && styles.fullWidthButton]}
                        onPress={handleNext}
                    >
                        <Text style={styles.primaryButtonText}>Next</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                        <Text style={styles.primaryButtonText}>Submit</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* OTP Modal */}
            <OTPModal
                visible={otpModalVisible}
                onClose={() => setOtpModalVisible(false)}
                onVerify={handleOtpVerify}
                phoneNumber={`+91 ${formData.mobile}`}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    contentContainer: {
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.teal.dark,
        textAlign: 'center',
        marginBottom: 24,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.gray[200],
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressCircleActive: {
        backgroundColor: COLORS.teal.main,
    },
    progressNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.gray[500],
    },
    progressNumberActive: {
        color: COLORS.white,
    },
    progressLine: {
        width: 60,
        height: 2,
        backgroundColor: COLORS.gray[200],
    },
    progressLineActive: {
        backgroundColor: COLORS.teal.main,
    },
    stepLabelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    stepLabel: {
        fontSize: 12,
        color: COLORS.gray[500],
        flex: 1,
        textAlign: 'center',
    },
    stepLabelActive: {
        color: COLORS.teal.dark,
        fontWeight: '600',
    },
    formSection: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray[700],
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    mobileInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    prefix: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.gray[700],
        marginRight: 8,
    },
    mobileInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 16,
    },
    dropdownText: {
        fontSize: 16,
        color: COLORS.black,
    },
    dropdownPlaceholder: {
        fontSize: 16,
        color: COLORS.gray[400],
    },
    dropdownArrow: {
        fontSize: 12,
        color: COLORS.gray[600],
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 8,
        marginBottom: 16,
        maxHeight: 200,
    },
    dropdownScroll: {
        maxHeight: 200,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[100],
    },
    dropdownItemText: {
        fontSize: 16,
        color: COLORS.black,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.teal.dark,
        marginBottom: 12,
    },
    checkboxGrid: {
        marginBottom: 24,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: COLORS.gray[300],
        borderRadius: 4,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: COLORS.teal.main,
        borderColor: COLORS.teal.main,
    },
    checkboxIcon: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    },
    checkboxLabel: {
        fontSize: 15,
        color: COLORS.gray[700],
    },
    uploadButton: {
        backgroundColor: COLORS.gray[100],
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    uploadButtonText: {
        fontSize: 15,
        color: COLORS.gray[700],
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    termsText: {
        fontSize: 14,
        color: COLORS.gray[700],
    },
    benefitsBox: {
        backgroundColor: COLORS.teal.lighter,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    benefitsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.teal.dark,
        marginBottom: 12,
    },
    benefitText: {
        fontSize: 14,
        color: COLORS.gray[700],
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: COLORS.teal.main,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: COLORS.gray[200],
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: COLORS.gray[700],
        fontSize: 16,
        fontWeight: '600',
    },
    fullWidthButton: {
        flex: 1,
    },
});
