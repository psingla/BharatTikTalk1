import React, { useEffect, useState } from 'react';
import SegmentedControl from '@react-native-community/segmented-control';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { AzureBlobService } from '../services/azure-blob-service';
import globalStyle from '../config/styles';
import ProfileHeader from '../components/ProfileHeader';
import Text from '../components/Text';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import Screen from '../components/Screen';
import profileApi from '../api/profile';
import UploadScreen from './UploadScreen';
import ImageInput from '../components/ImageInput';
import helper from '../services/Helper'
import useAuth from '../auth/useAuth';
import showToast from '../services/ToastService';


const ProfileEditScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const { userProfile } = route.params;
  const [profileData, setProfileData] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [firstName, setFirstName] = useState('');
  const [profilePhotoPath, setprofilePhotoPath] = useState(helper.getProfileUrl(userProfile?.profilePhotoPath));

  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      setProfileData(userProfile);
      setFirstName(userProfile.firstName);
      setLastName(userProfile.lastName);
      setprofilePhotoPath(helper.getProfileUrl(userProfile?.profilePhotoPath));
 
      setBio(userProfile.bio);
      if (userProfile.gender === 'M') setSelectedIndex(0);
      else if (userProfile.gender === 'F') setSelectedIndex(1);
      else setSelectedIndex(2);

     
    })(); 
  }, []);

  const onAddImage = (uri) => {
  
   let fileName = `${firstName}-${userProfile.userID}${helper.getFileExtension(uri)}`;
    AzureBlobService()
      .uploadMedia(uri, fileName, true)
      .then((rs) => {
        setprofilePhotoPath(fileName);
        setprofilePhotoPath(helper.getProfileUrl(userProfile?.profilePhotoPath));
        userProfile.profilePhotoPath = fileName
        handleSubmit();
      })
      .catch((e) => console.log(e));
  };
  const handleSubmit = async () => {
    setProgress(0);
    setUploadVisible(true);
    const result = await profileApi.updateProfile(
      {
        userID: user.userID,
        userName: profileData.userName,
        profilePhotoPath: userProfile.profilePhotoPath,
        bio: bio,
        firstName: firstName,
        gender: selectedIndex == 0 ? 'M' : selectedIndex == 1 ? 'F' : 'None',
        lastName: lastName,
      },
      (progress) => setProgress(progress)
    ).then((rs)=>{     
      if(!rs.ok){
        setUploadVisible(false);
        showToast('Could not save the listing');
      }
    });
  };
  
  return (
    <Screen>
      <UploadScreen onDone={() => setUploadVisible(false)} progress={progress} visible={uploadVisible} />
      <ProfileHeader onPress={() => navigation.pop()} headerText={`${userProfile.firstName} ${userProfile.lastName}`} leftIcon='back' />
      <ScrollView>
        <View style={{ padding: 10, alignItems: 'center' }}>
          <View style={[globalStyle.avatar, { flexDirection: 'row', overflow: 'hidden' }]}>
            <Image source={{ uri: profilePhotoPath }} style={[{ position: 'absolute', height: 100, width: 100 }]} />
            <ImageInput onChangeImage={(uri) => onAddImage(uri)} />
          </View>
          <Text style={{ fontSize: 18, padding: 10 }}>{profileData.userName}</Text>
        </View>
        <View>
          <TextInput icon='account' maxLength={20} onChangeText={(text) => setFirstName(text)} value={firstName} placeholder='first name' />
          <TextInput icon='account' maxLength={20} onChangeText={(text) => setLastName(text)} value={lastName} placeholder='last name' />
        </View>
        <View>
          <TextInput maxLength={100} icon='account' onChangeText={(text) => setBio(text)} value={bio} placeholder='bio' />
        </View>
        <View>
          <SegmentedControl
            tintColor='rgba(250, 54, 54, 0.5)'
            values={['Male', 'Female', 'None']}
            selectedIndex={selectedIndex}
            onChange={(event) => {
              setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
            }}
          />
        </View>
        <View style={(styles.profileColumn, { padding: 10, alignItems: 'center' })}>
          <Button
            title='Update'
            onPress={() => {
              handleSubmit();
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  profileColumn: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
});
export default ProfileEditScreen;
