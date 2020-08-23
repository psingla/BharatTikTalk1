import client from "./client";
import * as firebase from "firebase";
import * as Google from "expo-google-app-auth";
import * as Facebook from "expo-facebook";

import {
  ANDROID_GOOGLE_CLIENT_ID,
  IOS_GOOGLE_CLIENT_ID,
  FACEBOOK_APP_ID,
} from "@env";
import authStorage from "../auth/storage";

const login = (data) => {
  let notificationToken = "";
  authStorage
    .getNotificationToken()
    .then((rs) => {
      notificationToken = rs;
    })
    .catch((ex) => console.log("User registration failed..."))
    .finally(() => {
      client
        .post("/user/addUser", {
          ...data,
          notificationToken: notificationToken,
        })
        .then((resp) => {
          updateStore(resp.data.data);
        });
    });
};

const getUserDtails = (userName) =>
  client.get(`/User/getUserDetails/${userName}`).then((resp) => {
    updateStore(resp.data.data);
  });

const updateStore = (userData) => {
  console.log("auth..js....", userData);
  authStorage.storeUser(userData);
};

const signInWithGoogleAsync = async () => {
  try {
    const result = await Google.logInAsync({
      androidClientId: ANDROID_GOOGLE_CLIENT_ID,
      iosClientId: IOS_GOOGLE_CLIENT_ID,
      scopes: ["profile", "email"],
    });
    if (result.type === "success") return onGoogleSignIn(result);
  } catch (e) {
    console.log(e);
  }
  return null;
};

const signInWithFacebookAsync = async () => {
  try {
    await Facebook.initializeAsync(FACEBOOK_APP_ID);
    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ["public_profile", "email"],
    });
    if (type === "success") return onFacebookLogin(token);
  } catch ({ message }) {
    console.log(message);
  }
  return null;
};

function onGoogleSignIn(googleUser) {
  var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
    unsubscribe();

    var credential = firebase.auth.GoogleAuthProvider.credential(
      googleUser.idToken,
      googleUser.accessToken
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(function (result) {
        let data = {
          userName: result.user.email,
          email: result.user.email,
          profilePhotoPath: result.additionalUserInfo.profile.image,
          firstName: result.additionalUserInfo.profile.given_name,
          lastName: result.additionalUserInfo.profile.family_name,
        };
        if (result.additionalUserInfo.isNewUser === true) login(data);
        else getUserDtails(data.userName);

        //authStorage.storeUser(JSON.stringify(data));
        return data;
      })
      .catch(function (error) {
        console.log(errorCode, errorMessage);
      });
    return null;
  });
}
function onFacebookLogin(token) {
  var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
    unsubscribe();
    var credential = firebase.auth.FacebookAuthProvider.credential(token);
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(function (result) {
        let data = {
          userName: result.user.email,
          email: result.user.email,
          profilePhotoPath: result.user.photoURL,
          firstName: result.additionalUserInfo.profile.first_name,
          lastName: result.additionalUserInfo.profile.last_name,
        };
        if (result.additionalUserInfo.isNewUser === true) login(data);
        else getUserDtails(data.userName);

        return data;
      })
      .catch(function (error) {
        console.log(error);
      });
    return null;
  });
}

export default {
  signInWithGoogleAsync,
  signInWithFacebookAsync,
};
