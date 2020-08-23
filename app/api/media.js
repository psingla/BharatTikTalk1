import client from './client';

const endpoint = '/media/getMediaFeed/';

const getMediaFeed = (mediaType = 'Trending', userId = 0) =>
  client.get(`${endpoint}${mediaType}/${userId}`);

const addMedia = (data, onUploadProgress) =>
  client.post('/media/addMedia', data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });

export default {
  getMediaFeed,
  addMedia,
};
