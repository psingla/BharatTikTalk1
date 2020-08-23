import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FollowerScreen from '../screens/FollowerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileEditScreen from '../screens/ProfileEdit';

const Stack = createStackNavigator();

const ProfileNavigator = () => (
  <Stack.Navigator mode='modal' screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Profile' component={ProfileScreen} />
    <Stack.Screen name='ProfileEdit' component={ProfileEditScreen} />
    <Stack.Screen name='f' component={FollowerScreen} />
  </Stack.Navigator>
);

export default ProfileNavigator;
