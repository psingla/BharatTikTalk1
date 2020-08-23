import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeNavigator from './HomeNavigator';
import CameraNavigator from './CameraNavigator';
import ProfileNavigator from './ProfileNavigator';
import NewFeedButton from './NewFeedButton';
import colors from '../config/colors';
import BlankScreen from './BlankScreen';
import NotificationScreen from './NotificationScreen';

const Tab = createBottomTabNavigator();
const AppNavigator = () => (
  <Tab.Navigator
    tabBarOptions={{
      style: {
        backgroundColor: colors.black,
      },
    }}
  >
    <Tab.Screen
      name='Home'
      component={HomeNavigator}
      options={{
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name='home' color={color} size={size} />,
      }}
    />
    <Tab.Screen
      name='Game'
      component={BlankScreen}
      options={{
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name='youtube-tv' color={color} size={size} />,
      }}
    />
    <Tab.Screen
      name='Camera'
      component={CameraNavigator}
      options={({ navigation }) => ({
        tabBarVisible: false,
        tabBarButton: () => <NewFeedButton onPress={() => navigation.navigate('Camera')} />,
      })}
    />
    <Tab.Screen
      name='Notification'
      component={NotificationScreen}
      options={{
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name='bell' color={color} size={size} />,
      }}
    />
    <Tab.Screen
      name='Me'
      component={ProfileNavigator}
      options={{
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name='account' color={color} size={size} />,
      }}
    />

  </Tab.Navigator>
);

export default AppNavigator;
