import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types';
import LoginScreen from './src/screens/LoginScreen';
import RoadsideRegisterScreen from './src/screens/RoadsideRegisterScreen';
import FullDealerRegisterScreen from './src/screens/FullDealerRegisterScreen';
import MainTabs from './src/navigation/MainTabs';
import LeadDetailsScreen from './src/screens/LeadDetailsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import OfferSubmissionScreen from './src/screens/OfferSubmissionScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RoadsideRegister" component={RoadsideRegisterScreen} />
        <Stack.Screen name="FullDealerRegister" component={FullDealerRegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="LeadDetails" component={LeadDetailsScreen} />
        <Stack.Screen name="OfferSubmission" component={OfferSubmissionScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
