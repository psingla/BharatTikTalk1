import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import AppNavigator from './AppNavigator';
import colors from '../config/colors';
import useAuth from '../auth/useAuth';
function CustomDrawerContent(props) {
  const { logOut } = useAuth();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label='Sign Out' onPress={() => logOut()} />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName='Home'
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    drawerStyle={{
      backgroundColor: colors.white,
    }}
  >
    <Drawer.Screen name='Home' component={AppNavigator} />
  </Drawer.Navigator>
);

export default DrawerNavigator;
