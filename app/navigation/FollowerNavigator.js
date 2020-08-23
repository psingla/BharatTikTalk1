import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Followers from '../screens/followers';

const Stack = createStackNavigator();

const FollowerNavigator = () => (
  <Stack.Navigator mode='modal' screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Followers' component={Followers} />    
  </Stack.Navigator>
);

export default FollowerNavigator;
