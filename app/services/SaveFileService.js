import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';

export default saveFile = async (fileUri) => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === 'granted') {
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync('BhartTikTalk', asset, false);
  }
};
