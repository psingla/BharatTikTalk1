import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VideoList from '../screens/VideoList';

const HomeStack = createStackNavigator();
const HomeNavigator = () => (
  <HomeStack.Navigator headerMode='none'>
    <HomeStack.Screen name='Home' component={VideoList} />
  </HomeStack.Navigator>
);

export default HomeNavigator;
