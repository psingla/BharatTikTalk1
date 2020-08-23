import { StyleSheet, Dimensions, StatusBar } from 'react-native';

const { width: winWidth, height: winHeight } = Dimensions.get('window');

export default StyleSheet.create({
  alignCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },

  playButton: {
    width: winWidth,
    position: 'absolute',
    height: winHeight,
    bottom: 0,
    zIndex: 2,
  },
  leftToolbar: {
    width: winWidth / 5,
    position: 'absolute',
    height: winHeight / 4,
    right: 0,
    bottom: 150,
    zIndex: 3,
  },
  topToolbar: {
    width: winWidth,
    position: 'absolute',
    paddingTop: StatusBar.currentHeight,
    // height: StatusBar.currentHeight,
    top: 0,
    zIndex: 3,
  },
  bottomToolbar: {
    width: winWidth,
    position: 'absolute',
    height: 100,
    bottom: 0,
    zIndex: 3,
  },
  captureBtn: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 60,
    borderColor: '#FFFFFF',
  },
  captureBtnActive: {
    width: 80,
    height: 80,
  },
  captureBtnInternal: {
    width: 76,
    height: 76,
    borderWidth: 2,
    borderRadius: 76,
    backgroundColor: 'red',
    borderColor: 'transparent',
  },
  galleryContainer: {
    bottom: 100,
  },
  galleryImageContainer: {
    width: 75,
    height: 75,
    marginRight: 5,
  },
  galleryImage: {
    width: 75,
    height: 75,
  },
  avatar: {
    height: 100,
    width: 100,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 50,
  },
});
