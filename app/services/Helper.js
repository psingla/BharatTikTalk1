import {
  BLOB_STORAGE_URL,
  BLOB_PROFILE_CONTAINER_NAME,
  BLOB_VIDEO_CONTAINER_NAME,
  BLOB_SASKEY,
} from "@env";

const getFileExtension = (fileUri) => {
  return fileUri.substring(fileUri.lastIndexOf("."));
};

const isStartWithHttp = (uri) => {
  return !uri?.startsWith("http", 0);
};

const getSignedUri = (container, filePath) => {
  return `${BLOB_STORAGE_URL}${container}/${filePath}?${BLOB_SASKEY}`;
};

const getProfileUrl = (imagePath) => {
  if (isStartWithHttp(imagePath))
    return getSignedUri(BLOB_PROFILE_CONTAINER_NAME, imagePath);

  return imagePath;
};

const getVideoUrl = (videoPath) => {
  if (isStartWithHttp(videoPath))
    return getSignedUri(BLOB_VIDEO_CONTAINER_NAME, videoPath);

  return videoPath;
};

const numberFormatter = (num)=> {
  var digits = 2;
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "K" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "B" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
  }

export default {
  getFileExtension,
  getProfileUrl,
  getVideoUrl,
  numberFormatter
};
