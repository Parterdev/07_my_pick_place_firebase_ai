import React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AppTabParamList} from '../types/navigation';
import {HomeScreen} from '../screens/app/HomeScreen';
import {CapturePlaceScreen} from '../screens/app/CapturePlaceScreen';
import {GalleryScreen} from '../screens/app/GalleryScreen';
import {ProfileScreen} from '../screens/app/ProfileScreen';
import {useThemeMode} from '../hooks/useThemeMode';

const Tab = createBottomTabNavigator<AppTabParamList>();

const TabIcon = ({emoji}: {emoji: string}) => {
  return <Text style={{fontSize: 22}}>{emoji}</Text>;
};

export const AppTabs = () => {
  const {colors} = useThemeMode();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 68,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: () => <TabIcon emoji="🏠" />,
        }}
      />

      <Tab.Screen
        name="CapturePlace"
        component={CapturePlaceScreen}
        options={{
          title: 'Capturar',
          tabBarIcon: () => <TabIcon emoji="📸" />,
        }}
      />

      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          title: 'Galería',
          tabBarIcon: () => <TabIcon emoji="🖼️" />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: () => <TabIcon emoji="👤" />,
        }}
      />
    </Tab.Navigator>
  );
};