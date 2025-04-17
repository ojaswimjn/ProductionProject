import axios from "axios";
import { API_BASEURL } from "../authDisplayService";
import {getUserProfile} from "./authDisplayProfile"


const getRewardsPoint = async () => {
  try {
    const userProfile = await getUserProfile();
    const userId = userProfile.id;
    const response = await axios.get(`${API_BASEURL}/reward/?user_id=${userId}`, {
      headers: {
        'content-type': "application/json",
      },
    });

    console.log("rewards point heree:",response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching rewards data:", error);
    throw error;
  }
};

export { getRewardsPoint };
