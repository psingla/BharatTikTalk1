import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Video } from 'expo-av';
import AppButton from '../components/Button';

import Screen from '../components/Screen';

import { useIsFocused } from '@react-navigation/native';

function VideoEditScreen({ route, navigation }) {
  const { uri } = route.params;
  const isFocused = useIsFocused();
  return (
    <Screen>
      <View style={{ position: 'absolute', top: 40, right: 20 }}>
        <AppButton
          title='next'
          onPress={() => {
            navigation.navigate('Publish', { uri: uri });
          }}
        />
      </View>
      <Video
        style={styles.video}
        source={{ uri: uri }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode='cover'
        shouldPlay={true && isFocused}
        isLooping={true}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
});
export default VideoEditScreen;
