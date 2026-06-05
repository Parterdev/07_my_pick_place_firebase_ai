import React from 'react';
import {Image, ImageSourcePropType, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AppTabParamList} from '../types/navigation';
import {HomeScreen} from '../screens/app/HomeScreen';
import {CapturePlaceScreen} from '../screens/app/CapturePlaceScreen';
import {ProfileScreen} from '../screens/app/ProfileScreen';
import {useThemeMode} from '../hooks/useThemeMode';
import {GalleryNavigator} from './GalleryNavigator';
import {imageAssets, svgAssets} from '../assets/images';

const Tab = createBottomTabNavigator<AppTabParamList>();

interface PngTabIconProps {
  source: ImageSourcePropType;
  focused: boolean;
}

const PngTabIcon = ({source, focused}: PngTabIconProps) => {
  return (
    <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
      <Image
        source={source}
        style={[styles.pngIcon, focused && styles.activePngIcon]}
        resizeMode="contain"
      />
    </View>
  );
};

interface SvgTabIconProps {
  focused: boolean;
}

const HomeTabIcon = ({focused}: SvgTabIconProps) => {
  const HomeIcon = svgAssets.homeIcon;

  return (
    <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
      <HomeIcon width={28} height={28} />
    </View>
  );
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
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({focused}) => <HomeTabIcon focused={focused} />,
        }}
      />

      <Tab.Screen
        name="CapturePlace"
        component={CapturePlaceScreen}
        options={{
          title: 'Capturar',
          tabBarIcon: ({focused}) => (
            <PngTabIcon source={imageAssets.captureIcon} focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Gallery"
        component={GalleryNavigator}
        options={{
          title: 'Galería',
          tabBarIcon: ({focused}) => (
            <PngTabIcon source={imageAssets.imageGalleryIcon} focused={focused} />
          ),
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();

            navigation.navigate('Gallery', {
              screen: 'GalleryList',
            });
          },
        })}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({focused}) => (
            <PngTabIcon source={imageAssets.settingIcon} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    width: 38,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconWrapper: {
    transform: [{scale: 1.08}],
  },
  pngIcon: {
    width: 28,
    height: 28,
    opacity: 0.72,
  },
  activePngIcon: {
    opacity: 1,
  },
});