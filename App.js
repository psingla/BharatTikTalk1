import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as firebase from 'firebase';
import { AppLoading } from 'expo';
import { firebaseConfig } from './app/config/firebaseConfig';

import navigationTheme from './app/navigation/navigationTheme';
import OfflineNotice from './app/components/OfflineNotice';
import AuthContext from './app/auth/context';
import authStorage from './app/auth/storage';
import DrawerNavigator from './app/navigation/DrawerNavigator';
import { navigationRef } from './app/navigation/rootNavigation';
import NotificationService from './app/services/NotificationService';
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);
  React.useEffect(() => {
    loadNotificationToken();
  }, []);
  const loadNotificationToken = async () => {
    const notifyToken = await NotificationService.registerNotificationsAsync();
    await authStorage.storeNotificationToken(notifyToken);
  };
  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(JSON.parse(user));
  };
  if (!isReady) return <AppLoading startAsync={restoreUser} onFinish={() => setIsReady(true)} />;
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <OfflineNotice />
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <DrawerNavigator />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
