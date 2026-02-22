# TyrePlus Dealer Portal - React Native Expo App

A complete, production-ready React Native mobile app using Expo for the TyrePlus dealer portal with three main screens and navigation.

## Features

- **Login Screen**: Mobile OTP login and email/password login
- **Roadside Dealer Registration**: Quick registration for second-hand tyre dealers
- **Full Dealer Registration**: Multi-step form (3 steps) for complete dealer onboarding
- **Teal Color Theme**: Modern teal and white color scheme throughout
- **OTP Verification**: Reusable OTP modal for phone verification
- **React Navigation**: Seamless navigation between screens

## Tech Stack

- **Expo** - React Native framework
- **TypeScript** - Type safety
- **React Navigation** - Native stack navigation
- **NativeWind** - Tailwind CSS for React Native (configured but using StyleSheet for compatibility)
- **React Native Components** - Native UI components

## Project Structure

```
TDelaer/
├── App.tsx                          # Main app with navigation
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Reusable header with TyrePlus logo
│   │   └── OTPModal.tsx            # 6-digit OTP verification modal
│   ├── screens/
│   │   ├── LoginScreen.tsx         # Login with OTP/email/password
│   │   ├── RoadsideRegisterScreen.tsx  # Quick registration
│   │   └── FullDealerRegisterScreen.tsx # Multi-step registration
│   ├── constants/
│   │   └── theme.ts                # Color palette and design tokens
│   └── types/
│       └── index.ts                # TypeScript type definitions
├── global.css                       # Tailwind directives
├── tailwind.config.js              # Tailwind configuration
└── babel.config.js                 # Babel with NativeWind plugin

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on different platforms**:
   - **Web**: Press `w` in the terminal or run `npm run web`
   - **iOS**: Press `i` in the terminal or run `npm run ios` (requires Mac)
   - **Android**: Press `a` in the terminal or run `npm run android` (requires Android Studio)

## Usage

### Login Screen
- Enter mobile number with +91 prefix and click "Send OTP"
- Enter 6-digit OTP in the modal
- OR use email/password login
- Navigate to registration screens using bottom buttons

### Roadside Dealer Registration
- Fill in name, mobile number, and location
- Use "Use Current Location" button (placeholder)
- View benefits of joining
- Click "Register Now" to verify with OTP
- Navigate to full dealer registration if needed

### Full Dealer Registration
- **Step 1**: Enter business information (name, owner, mobile, email, GST, years)
- **Step 2**: Enter shop details (address, city, state, pincode)
- **Step 3**: Select services offered, brands dealt, upload documents, accept terms
- Submit to verify with OTP

## Color Scheme

The app uses a teal color palette:
- **Main Teal**: `#14B8A6`
- **Dark Teal**: `#0D9488`
- **Light Teal**: `#CCFBF1`
- **Lighter Teal**: `#F0FDFA`

## Notes

- This is a frontend-only implementation with placeholder alerts for form submissions
- OTP verification is simulated (accepts any 6-digit code)
- Document uploads are placeholder buttons
- Location services are not implemented yet
- No backend integration (all data is local state)

## Future Enhancements

- Backend API integration
- Real OTP verification
- Document upload functionality
- Geolocation services
- Form validation improvements
- Dashboard screens after login/registration
- AsyncStorage for session persistence

## License

This project is for demonstration purposes.
