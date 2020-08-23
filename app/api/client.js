import { create } from "apisauce";
import cache from "../utility/cache";
import settings from "../config/settings";

const apiClient = create({
  baseURL: settings.apiUrl,
});

// TO DO : invalidate cache
//Chaing timing 60-120minutes - may be calc based data
const get = apiClient.get;

apiClient.get = async (url, params, axiosConfig) => {
console.log("get api call", url);
  // const data = await cache.get(url);

  // if(data) return { ok: true, data };

  const response = await get(url, params, axiosConfig);

  if (response.ok) {
    cache.store(url, response.data);
    return response;
  }
  
};


export default apiClient;
