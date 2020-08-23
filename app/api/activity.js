import client from './client';

const activity = (body, activityType) =>
  client.post('/activity/', {
    body,
  });

export default {
  activity,
};
