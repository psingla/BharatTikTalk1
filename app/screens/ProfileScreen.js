import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Video } from "expo-av";
import { useIsFocused } from "@react-navigation/native";

import globalStyle from "../config/styles";
import ProfileHeader from "../components/ProfileHeader";
import Screen from "../components/Screen";
import Text from "../components/Text";
import AppButton from "../components/Button";
import profileApi from "../api/profile";
import userApi from "../api/users";
import useApi from "../hooks/useApi";
import ActivityIndicator from "./ActivityIndicator";
import useAuth from "../auth/useAuth";
import LoginScreen from "./LoginScreen";
import helper from "../services/Helper";

import colors from "../config/colors";
const ProfileScreen = ({ navigation }) => {
  const getProfileApi = useApi(profileApi.getProfile);
  const getUserfeedApi = useApi(userApi.getUserVideofeed);
  const isFocused = useIsFocused();
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      getProfileApi.request(user.userName);
      getUserfeedApi.request(user.userID);
    }
  }, [isFocused]);

  if (user === undefined) {
    return <LoginScreen />;
  }

  return (
    <>
      <ActivityIndicator visible={getProfileApi.loading} />
      <Screen>
        {getProfileApi.error && (
          <>
            <Text>Couldn't retrieve the profile data.</Text>
            <AppButton title="Retry" onPress={getProfileApi.request} />
          </>
        )}
        <ProfileHeader
          headerText={`${getProfileApi.data?.firstName} ${getProfileApi.data?.lastName}`}
          leftIcon="adduser"
        />
        <ScrollView>
          <View style={{ padding: 10, alignItems: "center" }}>
            <Image
              source={{
                uri: helper.getProfileUrl(getProfileApi.data?.profilePhotoPath),
              }}
              style={globalStyle.avatar}
            />
            <Text style={{ fontSize: 18, padding: 10 }}>
              {getProfileApi.data?.userName}
            </Text>
            <View style={styles.stats}>
              <View style={styles.statsColumn}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("f", {
                      userId: getProfileApi.data.userID,
                      isFollower: true,
                    });
                  }}
                >
                  <Text style={styles.statsNumber}>
                    {getProfileApi.data?.followers}
                  </Text>
                  <Text style={styles.statsText}>Followers</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.separator}>|</Text>
              <View style={styles.statsColumn}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("f", {
                      userId: getProfileApi.data.userID,
                      isFollower: false,
                    });
                  }}
                >
                  <Text style={styles.statsNumber}>
                    {getProfileApi.data?.followings}
                  </Text>
                  <Text style={styles.statsText}>Following</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.separator}>|</Text>
              <View style={styles.statsColumn}>
                <Text style={styles.statsNumber}>
                  {getProfileApi.data?.likes}
                </Text>
                <Text style={styles.statsText}>Likes</Text>
              </View>
            </View>
            <View style={styles.profileColumn}>
              <AppButton
                title="Edit profile"
                onPress={() => {
                  navigation.navigate("ProfileEdit", {
                    userProfile: getProfileApi.data,
                  });
                }}
              />
            </View>
            </View>
            <FlatList
              data={getUserfeedApi.data}
              numColumns={3}
              keyExtractor={(feed) => feed.mediaID.toString()}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <Video
                    source={{ uri: helper.getVideoUrl(item.mediaPath) }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
              )}
            />
        </ScrollView>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#dadada",
  },
  stats: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  avatar: {
    alignSelf: "center",
    width: 120,
    height: 140,
  },
  statsColumn: {
    alignItems: "center",
  },
  statsNumber: {
    fontSize: 18,
    padding: 10,
    fontWeight: "bold",
  },
  statsText: {
    fontSize: 12,
    color: "#8f8f91",
  },
  profileColumn: {
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
  },
  profileEdit: {
    borderWidth: 1.5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderColor: "#e6e6e6",
    borderRadius: 2,
    fontSize: 12,
  },
  separator: {
    color: "#000",
    fontSize: 20,
    opacity: 0.1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 5,
    height: 150,
    justifyContent: "center",
    margin: 1,
    overflow: "hidden",
    width: "33%"
  },
});
export default ProfileScreen;
