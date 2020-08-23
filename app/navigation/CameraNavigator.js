import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CameraScreen from '../screens/CameraScreen';
import VideoEditScreen from '../screens/VideoEditScreen';
import PublishScreen from '../screens/PublishScreen';

const Stack = createStackNavigator();

const CameraNavigator = () => (
  <Stack.Navigator mode='modal' screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Camera' component={CameraScreen} />
    <Stack.Screen name='Video' component={VideoEditScreen} />
    <Stack.Screen name='Publish' component={PublishScreen} />
  </Stack.Navigator>
);

export default CameraNavigator;
