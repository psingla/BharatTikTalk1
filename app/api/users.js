import client from "./client";

const register = (userInfo) => client.post("/users", userInfo);
const getFollowers = (userId, isfollowers) =>
  client.get(`/user/getUserFollowers/${userId}/${isfollowers}`);
const getUserNotification = (userId) =>
  client.get(`/user/getUserNotification/${userId}`);
const getUserVideofeed = (userId) => client.get(`/user/getUserVideo/${userId}`);
export default {
  register,
  getFollowers,
  getUserNotification,
  getUserVideofeed,
};
