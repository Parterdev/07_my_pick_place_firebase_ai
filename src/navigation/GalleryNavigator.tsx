import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GalleryStackParamList} from '../types/navigation';
import {GalleryScreen} from '../screens/app/GalleryScreen';
import {PlaceDetailScreen} from '../screens/app/PlaceDetailScreen';

const Stack = createNativeStackNavigator<GalleryStackParamList>();

export const GalleryNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="GalleryList" component={GalleryScreen} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} />
    </Stack.Navigator>
  );
};