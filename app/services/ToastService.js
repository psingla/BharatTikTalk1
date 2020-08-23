import { ToastAndroid } from 'react-native';

export default function showToast(toastMessage) {
  ToastAndroid.showWithGravityAndOffset(
    toastMessage,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER,
    -50,
    50
  );
}
