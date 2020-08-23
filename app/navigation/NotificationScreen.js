import React, { useEffect } from 'react'; 
import {FlatList, Image, Text, StyleSheet, View } from 'react-native';
import AppText from '../components/Text';
import Screen from '../components/Screen';
import userApi from "../api/users";
import useAuth from '../auth/useAuth';
import ProfileHeader from '../components/ProfileHeader';
import ActivityIndicator from '../screens/ActivityIndicator';
import Button from '../components/Button';
import colors from '../config/colors';
import ListItem from '../components/ListItem';
const NotificationScreen = ({ pros }) => {
    const { user } = useAuth();
    const getUserNotificationApi = useApi(userApi.getUserNotification);
    var title = 'Notifications';
    useEffect(() => {        
        getUserNotificationApi.request(25);
      }, []);
    

 return (
     <>
     <ActivityIndicator visible={getUserNotificationApi.loading} />
    <Screen>
    <ProfileHeader onPress={() => navigation.pop()} headerText={`${title}`} isSettingVisible={false} leftIcon='back' />
    {getUserNotificationApi.error && (
          <>
            <AppText>Couldn't retrieve the notifications.</AppText>
            <Button title='Retry' onPress={getUserNotificationApi.request} />
          </>
        )}
        <View style={{ flex: 1 }}>
           <FlatList
             data={getUserNotificationApi.data}
             keyExtractor={(media) => media.mediaID.toString()}
             renderItem={({ item }) => (
                <ListItem
                  title={item.taggedUserName}  
                  subtitle={'You have tagged in ' + item.mediaName}               
                  image={{ uri:item.taggedProfilePhotoPath }} 
                  leftImage= {{uri:item.taggedProfilePhotoPath}}                                       
                />            
             )}
           />    
        </View>
    </Screen>
 </>
 );
}

const styles = StyleSheet.create({    
    container: {
        flexDirection: 'row',
        padding: 10,
      },
      image: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
      },
      title: {
        color: colors.medium,
      },
      subtitle: {
        fontWeight: '500',
        color: colors.white,
        width:150
      },
      discrptions: {
        flexDirection: 'row',
        maxWidth:'80%'
      },
      time: {
        color: colors.medium,
        marginLeft:4
      },
});
export default NotificationScreen;