import * as firebase from 'firebase';
import { API_URL } from '@env';
import axios from 'axios';
function updateProfile(userName, image, firstName, lastName) {
  axios
    .post(`${API_URL}/user/addUser`, {
      userID: null,
      userName: userName,
      profilePhotoPath: image,
      bio: '',
      firstName: firstName,
      gender: 'None',
      lastName: lastName,
    })
    .then((res) => {
      if (res.status === 200) {
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function onSignIn(googleUser) {
  var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
    unsubscribe();
    if (!isUserEqual(googleUser, firebaseUser)) {
      var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.idToken, googleUser.accessToken);
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(function (result) {
        if (result.additionalUserInfo.isNewUser === true)
        {
              updateProfile(
            result.user.email,
            result.additionalUserInfo.profile.image,
            result.additionalUserInfo.profile.given_name,
            result.additionalUserInfo.profile.family_name
          );
        }
      
        })
        .catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
          console.log(errorCode, errorMessage);
        });
    } else {
      console.log('User is already signed-in Firebase with the correct user');
    }
  });
}
