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

export function checkLoginState(event,token) {
  if (event.id) {
    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
      unsubscribe();
      if (!isUserEqual(event.id, firebaseUser)) {
        var credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(function (result) {
         if(result.additionalUserInfo.isNewUser === true)
            {
              updateProfile(
              result.user.email,
              result.user.photoURL,
              result.additionalUserInfo.profile.first_name,
              result.additionalUserInfo.profile.last_name
            );
          }
          })
          .catch(function (error) {
            console.log(error);
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
          });
      } else {
        
      }
    });
  } else {
    //firebase.auth().signOut();
  }
}
