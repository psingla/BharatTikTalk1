import Constants from "expo-constants";
import { API_URL } from '@env';
const settings = {
  dev: {
    apiUrl: API_URL,
  },
  staging: {
    apiUrl: API_URL,
  },
  prod: {
    apiUrl: API_URL,
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
