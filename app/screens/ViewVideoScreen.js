import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  Share,
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import customStyle from '../config/styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

import { API_URL } from '@env';
import Comments from './Comment';
import * as Sharing from 'expo-sharing';
import showToast from '../services/ToastService';
import saveFile from '../services/SaveFileService';
import useLocation from '../hooks/useLocation';
import useIPAddress from '../hooks/useIPAddress';
import useAuth from '../auth/useAuth';
import LoginScreen from './LoginScreen';
import helper from '../services/Helper';

function ViewVideoListScreen({ media, play }) {
  const isFocused = useIsFocused();
  const [isPlay, setIsPlay] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [mediaDownloads, setMediaDownloads] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const [playDuration, setPlayDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoRef, setVideoRef] = useState({});
  const { user } = useAuth();

  const location = useLocation();
  const ipAddress = useIPAddress();
  const [commentCount, setCommentCount] = useState(media.comments);
  const opacity = 0.5;
  const fontColor = '#fff';

  useEffect(() => {
    console.log(location);
    setMediaDownloads(media.downloads);
    const source = axios.CancelToken.source();
    return () => {
      console.log(' clean up..');
      console.log(
        ' under render---',
        videoRef?.positionMillis != videoRef?.durationMillis
      );
      if (videoRef?.positionMillis != videoRef?.durationMillis) {
        updateApi(`/activity/addView`, {
          mediaIDs: [
            {
              mediaID: media?.mediaID,
              DurationInSec: videoRef?.positionMillis / 1000,
            },
          ],
        });
      }
      source.cancel();
    };
  }, [modalLogin]);

  async function updateApi(relateApiUri, bodyData) {
    bodyData = {
      ...bodyData,
      latitude: location?.latitude,
      longitude: location?.longitude,
      ipAddress: ipAddress,
      userID: user.userID,
    };

    axios
      .post(API_URL + relateApiUri, bodyData)
      .then((res) => {
        if (res.status === 200) {
          console.log('response 200 :');
        }
      })
      .catch(function (error) {
        console.log(relateApiUri, error);
      });
  }

  const openShareDialogAsync = async (mediaProp) => {
    const fileDetails = {
      extension: '.mp4',
      shareOptions: {
        mimeType: 'video/mp4',
        dialogTitle: 'Check out more video at Bhart.Tiktalk!',
        UTI: 'video/mp4',
        subject: 'Check out more video at Bhart.Tiktalk',
        message: 'Check out more video at Bhart.Tiktalk',
        title: 'Check out more video at Bhart.Tiktalk',
      },
    };
    const downloadPath = `${FileSystem.cacheDirectory}${mediaProp.username}${fileDetails.extension}`;
    const { uri: localUrl } = await FileSystem.downloadAsync(
      mediaProp.uri,
      downloadPath
    );
    if (!(await Sharing.isAvailableAsync())) {
      showMessage({
        message: 'Sharing is not available',
        description: 'Your device does not allow sharing',
        type: 'danger',
      });
      return;
    }
    //await onShare(localUrl);
    await Sharing.shareAsync(localUrl, fileDetails.shareOptions);
  };

  const onShare = async () => {
    try {
      const result = await Share.share(
        {
          message: media?.mediaPath,
          title: 'Bhart TikTalk Video',
          url: 'www.bhart.tiktalk.com',
        },
        { dialogTitle: 'Share - fun video' }
      );

      if (result.action === Share.sharedAction) {
        updateApi(`/activity/addShare`, {
          mediaIDs: [{ mediaID: media?.mediaID, applicationID: 1 }],
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const fileDownLoad = async () => {
    let lastIndex = media?.mediaPath.lastIndexOf('/');
    let fileName = media?.mediaPath.substring(lastIndex);
    let downloadResumable = FileSystem.createDownloadResumable(
      media?.mediaPath,
      FileSystem.documentDirectory + fileName,
      {},
      () => {
        // down progress monitor here
      }
    );
    try {
      const { uri } = await downloadResumable.downloadAsync().then((item) => {
        return item;
      });

      await saveFile(uri)
        .then((rs) => {
          showToast('Video saved to BhartTikTalk');
        })
        .then((rs) => {
          updateApi(`/activity/addDownload`, {
            mediaIDs: [media?.mediaID],
          });
        })
        .then((rs) => {
          setMediaDownloads(mediaDownloads + 1);
        });
    } catch (e) {
      console.error(e);
    }
  };

  const onPlaybackStatusUpdate = (playbackStatus) => {
    if (!playbackStatus.isLoaded) {
      // Update your UI for the unloaded state
      if (playbackStatus.error) {
        console.log(
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        );
        // Send Expo team the error on Slack or the forums so we can help you debug!
      }
    } else {
      // Update your UI for the loaded state
      let totalPalyedTime = playbackStatus.durationMillis / 1000;
      console.log(
        `totalPalyedTime:${playbackStatus.positionMillis}   playbackStatus.isPlaying == ${playbackStatus.isPlaying}`
      );
      if (playbackStatus.isPlaying) {
        //setIsPlaying(true);
        setPlayDuration(totalPalyedTime);
        // Update your UI for the playing state
      } else {
        // Update your UI for the paused state
        //setIsPlaying(false);
        //setPlayDuration(totalPalyedTime);
      }

      if (playbackStatus.didJustFinish) {
        // setIsPlaying(false);
        //setPlayDuration(totalPalyedTime);
        console.log(
          `${playbackStatus.isPlaying}== > not playing and :${totalPalyedTime}`
        );
        updateApi(`/activity/addView`, {
          mediaIDs: [
            {
              mediaID: media?.mediaID,
              DurationInSec: playbackStatus.durationMillis / 1000,
            },
          ],
        });
      }
    }
  };

  const addLike = () => {
    if (user) {
      updateApi(`/activity/addLike`, {
        mediaIDs: [
          {
            mediaLikeID: media?.mediaLikeID,
            mediaID: media?.mediaID,
            isDeleted: isLiked,
          },
        ],
      });

      setIsLiked(!isLiked);
      updateLikeCount(!isLiked);
      console.log(user);
      setModalLogin(false);
    } else {
      setModalLogin(true);
    }
  };

  const updateLikeCount = (isLike) => {
    media.likes = isLike ? media.likes + 1 : media.likes - 1;
  };

  return (
    <>
      <LinearGradient
        colors={['rgba(0,0,0,.3)', 'transparent']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '70%',
        }}
      />
      <View style={styles.videoContainer}>
        <Video
          // onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          style={styles.video}
          source={{ uri: helper.getVideoUrl(media?.mediaPath) }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay={play && isPlay && isFocused}
          isLooping={true}
          //shouldCorrectPitch={true}
          ref={(ref) => {
            setVideoRef(ref);
          }}
        />
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <Comments
            mediaID={media?.mediaID}
            closeModal={() => {
              setModalVisible(false);
            }}
            updateCommentCount={(newCount) => {
              setCommentCount(newCount);
            }}
          />
        </Modal>
        <Modal animationType="slide" transparent={true} visible={modalLogin}>
          <LoginScreen />
        </Modal>
      </View>
      <View style={styles.details}>
        <Text style={styles.user}>{media?.mediaUserName}</Text>
        <Text style={styles.tags}>{media?.mediaCaption}</Text>
        <View style={styles.musicBox}>
          <FontAwesome name="music" color="#f5f5f5" size={15} />
          <Text style={styles.music}>{media?.audioTrackName}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity activeOpacity={opacity} style={[styles.boxAction]}>
          <FontAwesome name="eye" size={30} color={fontColor} />
          <Text style={styles.textAction}>4</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={opacity}
          style={[styles.boxAction]}
          onPress={addLike}
        >
          <AntDesign name="heart" size={30} color={isLiked ? 'red' : 'white'} />
          <Text style={styles.textAction}>{media.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={opacity}
          style={styles.boxAction}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <FontAwesome name="commenting" size={30} color={fontColor} />
          <Text style={styles.textAction}>{commentCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={opacity}
          style={styles.boxAction}
          onPress={() => {
            onShare();
          }}
        >
          <FontAwesome name="share-alt" size={35} color={fontColor} />
          <Text style={styles.textAction}>{media.shares}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={opacity}
          style={styles.boxAction}
          onPress={() => {
            fileDownLoad();
          }}
        >
          <FontAwesome name="download" size={35} color={fontColor} />
          <Text style={styles.textAction}>{mediaDownloads}</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={opacity} style={styles.boxAction}>
          <Image
            style={{
              width: 35,
              height: 35,
              borderRadius: 25,
            }}
            source={{
              uri: media?.mediaUserProfilePhotoPath,
            }}
          />
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback
        onPress={() => setIsPlay(isPlay ? false : true)}
      >
        <View style={[customStyle.playButton, customStyle.alignCenter]}>
          {!isPlay && <Ionicons name="md-play" color="white" size={50} />}
        </View>
      </TouchableWithoutFeedback>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,.4)']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '50%',
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  details: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'column',
    bottom: 0,
    zIndex: 10,
    paddingBottom: 5,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'left',
    justifyContent: 'space-around',
  },
  user: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 0,
    paddingRight: 0,
    color: '#fff',
  },
  tags: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
    paddingBottom: 10,
    paddingTop: 5,
    color: '#fff',
  },
  musicBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  music: {
    fontSize: 15,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingTop: 5,
    paddingRight: 5,
    flexShrink: 1,
    color: '#fff',
  },
  actions: {
    flexDirection: 'column',
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    bottom: 0,
    right: 8,
    zIndex: 10,
  },
  boxAction: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    margin: 1,
    padding: 1,
    alignContent: 'center',
    paddingBottom: 5,
  },
  textAction: {
    color: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'center',
  },
});
export default ViewVideoListScreen;
