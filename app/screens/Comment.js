import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import useLocation from "../hooks/useLocation";
import useIPAddress from "../hooks/useIPAddress";
import ListItem from "../components/ListItem";
import useAuth from "../auth/useAuth";
import helper from '../services/Helper'

const Comments = (props) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const location = useLocation();
  const ipAddress = useIPAddress();
  const { user } = useAuth();

  useEffect(() => {
    getCommentById(props.mediaID);
  }, []);

  async function getCommentById(id) {
    await axios.get(`${API_URL}/activity/getMediaComment/${id}`).then((res) => {
      if (res.status === 200) {
        setComments(res.data.data);
      }
    });
  }
  function randomFunction() {
    props.closeModal();
  }

  function updateApi(relateApiUri, bodyData) {
    console.log("Mohit1");
    console.log(bodyData);
    bodyData = {
      ...bodyData,
      latitude: location.latitude,
      longitude: location.longitude,
      ipAddress: ipAddress,
      mediaID: props.mediaID,
    };
    axios.post(API_URL + relateApiUri, bodyData).then((res) => {
      if (res.status === 200) {
        setComments((comments) => {
          let currenttime = new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60000
          ).toISOString();
          let newComments = [
            ...comments,
            {
              comment: bodyData.comments[0]["comment"],
              mediaCommentID: res.data.data,
              modifiedon: currenttime,
              parentMediaCommentID: 0,
              profilePhotoPath: user.profilePhotoPath,
              userName: user.userName,
              useruserID: user.userID
            },
          ];

          props.updateCommentCount(newComments.length);
          return newComments;
        });
        console.log(relateApiUri, " is success full");
      }
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent} onPress={() => randomFunction()}>
          <TouchableOpacity onPress={() => randomFunction()}>
            <Ionicons name="md-close" size={35} color={colors.medium} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText} onPress={() => randomFunction()}>
          Comments
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={comments}
          keyExtractor={(comment) => comment.mediaCommentID.toString()}
          renderItem={({ item }) => (
            <ListItem
              title={item.userName}
              subtitle={item.comment}
              time="2hr"
              image={{
                uri:helper.getProfileUrl(item.profilePhotoPath)
              }}
            />
          )}
        />
      </View>
      <View style={styles.messagebox}>
        <TextInput
          style={{
            marginLeft: 8,
            minHeight: 50,
            minWidth: "80%",
            maxWidth: "80%",
            borderBottomWidth: 1.5,
            padding: 10,
            borderBottomColor: "#000",
            color: "white",
          }}
          onChangeText={(text) => setComment(text)}
          placeholder="Add Comments"
          value={comment}
          multiline
        />
        <TouchableOpacity
          style={{ alignContent: "center" }}
          disabled={comment.length == 0}
          onPress={() => {
            updateApi(`/activity/addComment`, {
              userId: user.userID,
              comments: [{ mediaCommentID: null, comment: comment }],
            });

            setComment("");
          }}
        >
          <Text style={{ marginRight: 15, color: "blue" }}>POST</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.dark,
    position: "absolute",
    height: "70%",
    bottom: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffe",
    borderRadius: 10,
    overflow: "hidden",
  },
  messagebox: {
    flex: 0.14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  header: {
    flex: 0.1,
    flexDirection: "row",
    paddingVertical: 5,


    alignItems: "center",
  },
  headerText: {
    color: "#313643",
    fontSize: 20,
  },
  headerContent: {
    marginLeft: 12,
    marginRight: 18,
  },
});

export default Comments;
