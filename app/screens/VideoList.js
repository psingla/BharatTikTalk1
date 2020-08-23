import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import mediaApi from '../api/media';
import ActivityIndicator from './ActivityIndicator';
import Screen from '../components/Screen';
import ViewVideoListScreen from './ViewVideoScreen';
import useApi from '../hooks/useApi';
import AppText from '../components/Text';
import Button from '../components/Button';
import colors from '../config/colors';
import useAuth from '../auth/useAuth';

export default function VideoList() {
  const { user } = useAuth();
  const [active, setActive] = useState(0);
  const [activeTab, setActiveTab] = useState(1);

  const getMediaFeedApi = useApi(mediaApi.getMediaFeed);

  useEffect(() => {
    getMediaFeedApi.request('Trending', user.userID);
  }, []);
  const onPress = (index) => {
    setActiveTab(index);
    if (index == 0) getMediaFeedApi.request('Following', user.userID);
    else getMediaFeedApi.request('Trending', user.userID);
  };
  return (
    <>
      <ActivityIndicator visible={getMediaFeedApi.loading} />

      <Screen>
        {getMediaFeedApi.error && (
          <>
            <AppText>Couldn't retrieve the video.</AppText>
            <Button title="Retry" onPress={getMediaFeedApi.request} />
          </>
        )}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => onPress(0)}>
            <AppText
              style={[
                styles.button,
                { color: activeTab === 0 ? colors.white : colors.medium },
              ]}
            >
              Following
            </AppText>
          </TouchableOpacity>
          <AppText style={[styles.button, { margin: 20 }]}>|</AppText>
          <TouchableOpacity onPress={() => onPress(1)}>
            <AppText
              style={[
                styles.button,
                { color: activeTab === 1 ? colors.white : colors.medium },
              ]}
            >
              Trending
            </AppText>
          </TouchableOpacity>
        </View>
        <ViewPager
          onPageSelected={(e) => {
            setActive(e.nativeEvent.position);
          }}
          style={styles.viewPager}
          initialPage={0}
          orientation="vertical"
        >
          {getMediaFeedApi.data.map((item, index) => (
            <View style={styles.page} key={index}>
              <ViewVideoListScreen media={item} play={index === active} />
            </View>
          ))}
        </ViewPager>
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

  header: {
    height: '10%',
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
    alignItems: 'center',
  },
  button: {
    color: colors.medium,
  },
});
