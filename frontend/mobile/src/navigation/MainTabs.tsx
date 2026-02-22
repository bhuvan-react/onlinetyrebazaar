import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Home, ClipboardList, Wallet, BarChart3, Settings } from 'lucide-react-native';
import { BottomTabParamList } from '../types';
import { COLORS } from '../constants/theme';
import DashboardScreen from '../screens/DashboardScreen';
import LeadsScreen from '../screens/LeadsScreen';
import WalletScreen from '../screens/WalletScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CustomHeader from '../components/CustomHeader';
import SidebarModal from '../components/SidebarModal';
import NotificationsModal from '../components/NotificationsModal';
import ProfileModal from '../components/ProfileModal';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function MainTabs() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [notifVisible, setNotifVisible] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false);

    const renderHeader = (title: string) => (
        <CustomHeader
            title={title}
            onMenuPress={() => setSidebarVisible(true)}
            onNotificationPress={() => setNotifVisible(true)}
            onProfilePress={() => setProfileVisible(true)}
        />
    );

    return (
        <>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    header: () => renderHeader(route.name),
                    tabBarActiveTintColor: COLORS.teal.main,
                    tabBarInactiveTintColor: COLORS.gray[400],
                    tabBarStyle: styles.tabBar,
                    tabBarLabelStyle: styles.tabLabel,
                })}
            >
                <Tab.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Leads"
                    component={LeadsScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Wallet"
                    component={WalletScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Stats"
                    component={StatsScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
                    }}
                />
            </Tab.Navigator>

            {/* Global Modals */}
            <SidebarModal visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
            <NotificationsModal visible={notifVisible} onClose={() => setNotifVisible(false)} />
            <ProfileModal visible={profileVisible} onClose={() => setProfileVisible(false)} />
        </>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
        backgroundColor: COLORS.white,
        borderTopColor: COLORS.gray[200],
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
});
