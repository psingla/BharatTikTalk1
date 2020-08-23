import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import customStyles from '../config/styles';

import AuthApi from '../api/auth';
import authStorage from '../auth/storage';
import NotificationService from '../services/NotificationService';
function LoginScreen() {
  const handlePress = async (mode) => {
    if (mode === 'facebook') {
      await AuthApi.signInWithFacebookAsync();
    } else {
      await AuthApi.signInWithGoogleAsync();
    }
  };
  React.useEffect(() => {
 //   loadNotificationToken();
  }, []);
  const loadNotificationToken = async () => {
    const notifyToken = await NotificationService.registerNotificationsAsync();
    await authStorage.storeNotificationToken(notifyToken);
    console.log(await authStorage.getNotificationToken());
  };

  return (
    <>
      <View style={customStyles.alignCenter}>
        <TouchableOpacity style={{ width: '86%', marginTop: 10 }} onPress={() => handlePress('facebook')}>
          <View style={styles.button}>
            <SimpleLineIcons name='social-facebook' size={24} color='white' style={{ marginRight: 20 }} />
            <Text
              style={{
                letterSpacing: 0.5,
                fontSize: 16,
                color: '#FFFFFF',
              }}
            >
              Continue with Facebook
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '86%', marginTop: 10 }} onPress={() => handlePress('google')}>
          <View style={styles.googleButton}>
            <FontAwesome name='google' size={24} color='red' style={{ marginRight: 20 }} />
            <Text
              style={{
                letterSpacing: 0.5,
                fontSize: 16,
                color: '#707070',
              }}
            >
              Continue with Google
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '86%',
    marginTop: 15,
  },
  logo: {
    marginTop: 20,
  },
  input: {
    fontSize: 20,
    borderColor: '#707070',
    borderBottomWidth: 1,
    paddingBottom: 1.5,
    marginTop: 25.5,
  },
  button: {
    backgroundColor: '#3A559F',
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#707070',
  },
});
export default LoginScreen;
