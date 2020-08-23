import * as Location from "expo-location";

export default GetLocation = async () => {
  try {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
    }

    var location = await Location.getCurrentPositionAsync({});
    return location;
  } catch (e) {
    console.log("error");
  }
};
