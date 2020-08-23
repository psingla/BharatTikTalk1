import client from "./client";
const endpoint = "/user/getUserDetails/";
import authStorage from "../auth/storage";
import cache from "../utility/cache";
const getProfile = (email) => client.get(endpoint + email);

const updateProfile = (data, onUploadProgress) =>
  client
    .post("/user/addUser", data, {
      onUploadProgress: (progress) =>
        onUploadProgress(progress.loaded / progress.total),
    })
    .then(async (rs) => {
     cache.removeChacheByKey(`/user/getUserDetails/${data.userName}`);
     await authStorage.storeUser(data);
      return rs;
    });

export default {
  getProfile,
  updateProfile,
};
