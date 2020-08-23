import * as SecureStore from 'expo-secure-store';
const key = 'user';

const storeUser = async (user) => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(user));
  } catch (error) {
    console.log('Error storing the auth token', error);
  }
};

const storeNotificationToken = async (notoficationKey) => {
  try {
    await SecureStore.setItemAsync('NotifyToken', notoficationKey);
  } catch (error) {
    console.log('Error storing the auth token', error);
  }
};
const getNotificationToken = async () => {
  try {
    return await SecureStore.getItemAsync('NotifyToken');
  } catch (error) {
    console.log('Error getting the auth token', error);
  }
};

const getUserInfo = async () => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.log('Error getting the auth token', error);
  }
};

const getUser = async () => {
  const info = await getUserInfo();
  return info ? info : null;
};

const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log('Error removing the auth token', error);
  }
};

export default { getUser, removeToken, storeUser, storeNotificationToken, getNotificationToken };
