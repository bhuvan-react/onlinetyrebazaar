import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
    Login: undefined;
    RoadsideRegister: undefined;
    FullDealerRegister: undefined;
    MainTabs: NavigatorScreenParams<BottomTabParamList>;
    LeadDetails: { leadId: string };
    OfferSubmission: { leadId: string };
    EditProfile: undefined;
};

export type BottomTabParamList = {
    Dashboard: undefined;
    Leads: { filter?: string } | undefined;
    Wallet: undefined;
    Stats: undefined;
    Settings: undefined;
};

export interface OTPModalProps {
    visible: boolean;
    onClose: () => void;
    onVerify: (otp: string) => void;
    phoneNumber?: string;
}

export interface HeaderProps {
    subtitle: string;
}

export interface RoadsideFormData {
    name: string;
    mobile: string;
    password: string;
    location: string;
}

export interface FullDealerFormData {
    // Step 1: Business Info
    businessName: string;
    ownerName: string;
    mobile: string;
    email: string;
    password: string;
    gstNumber: string;
    yearsInBusiness: string;

    // Step 2: Shop Details
    shopAddress: string;
    city: string;
    state: string;
    pincode: string;

    // Step 3: Services & Brands
    services: string[];
    brands: string[];
    termsAccepted: boolean;
}


export interface QuestionnaireItem {
    id: string;
    question: string;
    answer: string | string[];
    type?: 'text' | 'tags' | 'boolean_list'; // Optional hint for UI rendering if needed, but we can infer from answer type
}

export interface Lead {
    id: string;
    customerName: string;
    location: string;
    vehicleModel: string;
    serviceRequest: string;
    status: 'NEW' | 'BOUGHT' | 'FOLLOW_UP' | 'CONVERTED' | 'NEW_LEAD' | 'NEW LEAD' | 'CONTACTED' | 'LOST';
    questionnaire?: QuestionnaireItem[];
}
