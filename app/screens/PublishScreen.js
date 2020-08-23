import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { AzureBlobService } from '../services/azure-blob-service';
import AppText from "../components/Text";
import AppButton from '../components/Button';
import colors from '../config/colors';
import useLocation from '../hooks/useLocation';
import useIPAddress from '../hooks/useIPAddress';
import useAuth from '../auth/useAuth';
import AppTextInput from '../components/TextInput';
import Screen from '../components/Screen';
import mediaApi from '../api/media';
import showToast from '../services/ToastService';
import UploadScreen from './UploadScreen';
import saveFile from '../services/SaveFileService';
import NotificationService from '../services/NotificationService';

const PublishScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { uri } = route.params;
  const [mediaName, setMediaName] = useState('');
  const [value, onChangeText] = React.useState('');
  const location = useLocation();
  const ipAddress = useIPAddress();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMediaName(`${user.userName}-${new Date().getTime()}`);
  }, []);

  const uploadVideo = () => {
    AzureBlobService()
      .uploadMedia(uri, mediaName, false)
      .then(async () => {
        setProgress(0);
        setUploadVisible(true);
        const result = await mediaApi.addMedia(
          {
            userID: user.userID,
            mediaName,
            caption: value,
            mediaPath: mediaName,
            mediaSize: 1,
            audioTrackID: 1,
            audioTrackName: 'test.audio',
            audioTrackPath: 'test.mp3',
            audioTrackSize: 2,
            ...location,
            ipAddress: ipAddress,
          },
          (progress) => setProgress(progress)
        );
        if (!result.ok) {
          setUploadVisible(false);
          showToast('Could not save the video data.');
        } else {
          navigation.popToTop();
        }
      })
      .catch((e) => console.log(e));
  };

  const downloadVideo = async () => {
    setUploadVisible(true);
    await saveFile(uri).then((rs) => {
      setUploadVisible(false);
      showToast('Video saved to BhartTikTalk');
    });
  };

  const notifyUsers=(userPushTokenArray, title, body)=>
  {
    NotificationService.sendNotificationAsync(userPushTokenArray, title, body).then(()=>console.log("notification sent sucessfully."));
  }

  return (
    <>
      <UploadScreen onDone={() => setUploadVisible(false)} progress={progress} visible={uploadVisible} />
      <Screen style={styles.container}>
        <AntDesign name='back' color='white' size={20} onPress={() => navigation.goBack()} />
        <AppTextInput
          multiline={true}
          numberOfLines={5}
          editable
          maxLength={100}
          onChangeText={(text) => onChangeText(text)}
          value={value}
          placeholder='Put description here ....'
          style={styles.description}
        />
         <TouchableOpacity onPress={() => alert("tag user")}>
            <AppText
              style={[
                styles.button,
                { color:  colors.medium },
              ]}
            >
             Click to Tag Users
            </AppText>
          </TouchableOpacity>
        
        <View style={styles.imageContainer}>
          <Image source={{ uri: uri }} style={styles.image} />
        </View>
      </Screen>
      <KeyboardAvoidingView style={styles.bottomBar}>
        <AppButton title='Save' onPress={downloadVideo} />
        <AppButton title='Publish' onPress={uploadVideo} />
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  imageContainer: {
    alignItems: 'center',
    backgroundColor: colors.light,
    opacity: 0.7,
    borderRadius: 15,
    height: 100,
    justifyContent: 'center',
    marginVertical: 10,
    overflow: 'hidden',
    width: 100,
  },
  description: {
    color: colors.white,
    width: '100%',
    textAlignVertical: 'top',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bottomBar: {
    bottom: 0,
    width: '100%',
    position: 'absolute',
  },
});
export default PublishScreen;
