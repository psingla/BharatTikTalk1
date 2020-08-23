import React, { useState, useEffect } from 'react';
import {FlatList, StyleSheet, View } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import ListItem from '../components/ListItem';
import axios from 'axios';
import { API_URL } from '@env';
import userApi from "../api/users";
import ActivityIndicator from './ActivityIndicator';
import useLocation from '../hooks/useLocation';
import useIPAddress from '../hooks/useIPAddress';
import Screen from '../components/Screen';
import useApi from '../hooks/useApi';
import AppText from '../components/Text';
import Button from '../components/Button';
import ProfileHeader from '../components/ProfileHeader';
import helper from '../services/Helper'
import cache from "../utility/cache";

  const FollowerScreen = ({ navigation, route }) => {
  const  { userId, isFollower}  = route.params;
  const [active, setActive] = useState(0);
  const location = useLocation();
  const ipAddress = useIPAddress();
  const getUserFollowerApi = useApi(userApi.getFollowers);
  var title = (isFollower==true ? 'Followers' :'Followings');
  useEffect(() => {
    console.log("follow list", JSON.stringify( getUserFollowerApi.data));
    getUserFollowerApi.request(userId,isFollower);      
  }, []);

  function updateApi(relateApiUri, bodyData) {    
    bodyData = {
      ...bodyData,
      latitude: location.latitude,
      longitude: location.longitude,
      ipAddress: ipAddress     
    };
    axios.post(API_URL + relateApiUri, bodyData).then((res) => {
      if (res.status === 200) {        
        console.log(relateApiUri, ' is success full');
        cache.removeChacheByKey(`/user/getUserFollowers/${userId}/${isFollower}`);
      }
    });
  }


  return (
    <>
      <ActivityIndicator visible={getUserFollowerApi.loading} />
      <Screen>
      <ProfileHeader onPress={() => navigation.pop()} headerText={`${title}`} isSettingVisible={false} leftIcon='back' />
        {getUserFollowerApi.error && (
          <>
            <AppText>Couldn't retrieve the video.</AppText>
            <Button title='Retry' onPress={getUserFollowerApi.request} />
          </>
        )}
            
           <View style={{ flex: 1 }}>
           <FlatList
             data={getUserFollowerApi.data}
             keyExtractor={(user) => user.userID.toString()}
             renderItem={({ item }) => (
               <ListItem
               subtitle={item.displayName}                
                 image={{ uri: helper.getProfileUrl(item.profilePhotoPath) }}
                 caption={isFollower ?'Follow':'UnFollow'} 
                 onpress={() => {
                  updateApi(`/user/addFollow`, {
                    followerUserID: userId,
                    followedIDs: [{followID: item.followID, followedUserID: item.userID, isDeleted: !isFollower }]
                  }
                  
                  );                      
                }}         
               />
             )}
           />
         </View>          
       
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
    
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FollowerScreen;
